import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://www.arte-refact.com/works/';
const QUERY = '?cst&query-77-taxQuery-creators%5B0%5D=25';
const WORKS_DIR = join(__dirname, '..', '_works');
const MEDIA_DIR = join(__dirname, '..', 'public', 'works', 'media');
const OUTPUT_JSON = join(__dirname, 'scraped-works.json');

// Rate limit: wait between requests
const DELAY_MS = 300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Step 1: Collect all work URLs from listing pages ----
async function fetchListingPage(page) {
  const url =
    page === 1
      ? `${BASE_URL}${QUERY}`
      : `${BASE_URL}${QUERY}&query-77-page=${page}`;
  console.log(`Fetching listing page ${page}...`);
  const res = await fetch(url);
  const html = await res.text();

  const works = [];
  // Extract each <li> card
  const cardRegex =
    /class="wp-block-post post-(\d+)[^"]*"[\s\S]*?<\/article>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = match[0];
    const postId = match[1];

    // Extract title
    const titleMatch = cardHtml.match(
      /is_query_works_post_title[^>]*><a[^>]*>([^<]+)<\/a>/
    );
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : '';

    // Extract URL
    const urlMatch = cardHtml.match(
      /href="(https:\/\/www\.arte-refact\.com\/works\/\d+\/)"/
    );
    const detailUrl = urlMatch ? urlMatch[1] : '';

    // Extract date
    const dateMatch = cardHtml.match(
      /acf_works_release_date">([^<]+)<\/span>/
    );
    const dateStr = dateMatch ? dateMatch[1].trim() : '';

    // Extract release type
    const typeMatch = cardHtml.match(
      /acf_works_release_type">([^<]+)<\/span>/
    );
    const releaseType = typeMatch ? typeMatch[1].trim() : '';

    // Extract image URL (first img src)
    const imgMatch = cardHtml.match(/src="([^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    // Extract image dimensions
    const widthMatch = cardHtml.match(/width="(\d+)"/);
    const heightMatch = cardHtml.match(/height="(\d+)"/);
    const imgWidth = widthMatch ? parseInt(widthMatch[1]) : 0;
    const imgHeight = heightMatch ? parseInt(heightMatch[1]) : 0;

    if (detailUrl) {
      works.push({
        postId,
        title,
        detailUrl,
        dateStr,
        releaseType,
        imageUrl,
        imgWidth,
        imgHeight,
      });
    }
  }

  return works;
}

// ---- Step 2: Fetch detail page ----
async function fetchDetailPage(work) {
  const res = await fetch(work.detailUrl);
  const html = await res.text();

  // Extract description
  const descMatch = html.match(
    /entry-content[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/
  );
  let descHtml = descMatch ? descMatch[1] : '';

  // Extract description text (paragraphs)
  const descTexts = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
  let pMatch;
  while ((pMatch = pRegex.exec(descHtml)) !== null) {
    const text = pMatch[1]
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<[^>]*>/g, '')
      .trim();
    if (text) descTexts.push(text);
  }
  work.description = descTexts.join('\n');

  // Extract buttons/links
  work.links = [];
  const buttonRegex =
    /wp-block-button__link[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
  let btnMatch;
  while ((btnMatch = buttonRegex.exec(descHtml)) !== null) {
    work.links.push({ url: btnMatch[1], label: btnMatch[2].trim() });
  }

  // Extract YouTube embeds
  work.youtubeEmbeds = [];
  const iframeRegex = /<iframe[^>]*src="([^"]*youtube[^"]*)"[^>]*>/g;
  let iframeMatch;
  while ((iframeMatch = iframeRegex.exec(html)) !== null) {
    work.youtubeEmbeds.push(iframeMatch[1]);
  }

  // Extract image from detail page (og:image or featured image)
  const ogImgMatch = html.match(
    /property="og:image"\s+content="([^"]*)"/
  );
  if (ogImgMatch) {
    work.imageUrl = ogImgMatch[1];
  }

  // Get image dimensions from og tags
  const ogWidthMatch = html.match(
    /property="og:image:width"\s+content="(\d+)"/
  );
  const ogHeightMatch = html.match(
    /property="og:image:height"\s+content="(\d+)"/
  );
  if (ogWidthMatch) work.imgWidth = parseInt(ogWidthMatch[1]);
  if (ogHeightMatch) work.imgHeight = parseInt(ogHeightMatch[1]);

  // Also try to get from the featured image in the content
  const featuredImgMatch = html.match(
    /wp-block-post-featured-image[^>]*>.*?<img[^>]*width="(\d+)"[^>]*height="(\d+)"[^>]*src="([^"]*)"/s
  );
  if (featuredImgMatch) {
    work.imgWidth = parseInt(featuredImgMatch[1]);
    work.imgHeight = parseInt(featuredImgMatch[2]);
    work.imageUrl = featuredImgMatch[3];
  }

  return work;
}

// ---- Step 3: Parse data ----
function parseTitle(fullTitle) {
  // Patterns:
  // "アーティスト / サブ「タイトル」" → holder, artist, title
  // "『フランチャイズ』タイトル" → holder, title
  // "アーティスト「タイトル」" → artist, title

  let holder = '';
  let artist = '';
  let title = fullTitle;

  // Pattern: 「...」 extracts inner title
  const kakkoMatch = fullTitle.match(/「([^」]+)」/);

  // Pattern: 『...』 extracts franchise/holder
  const kagikakkoMatch = fullTitle.match(/『([^』]+)』/);

  // Pattern: " / " splits artist parts
  const slashParts = fullTitle.split(' / ');

  if (kagikakkoMatch) {
    // Franchise-style title like 『HELIOS Rising Heroes』
    holder = kagikakkoMatch[1];
    if (kakkoMatch) {
      title = kakkoMatch[1];
      // Artist might be between 』 and 「
      const betweenMatch = fullTitle.match(/』\s*(.+?)\s*「/);
      if (betweenMatch) {
        const between = betweenMatch[1].trim();
        if (between && !between.match(/^(THIRD|SEASON|第|ED|OP|主題歌|挿入歌|エンディング)/)) {
          artist = between;
        }
      }
    } else {
      // No 「」, title is everything after 』
      const afterMatch = fullTitle.match(/』\s*(.+)/);
      if (afterMatch) {
        title = afterMatch[1].trim();
      }
    }
  } else if (slashParts.length >= 2 && kakkoMatch) {
    // "ホルダー / アーティスト「タイトル」"
    holder = slashParts[0].trim();
    // Get artist from the part before 「
    const artistPart = slashParts.slice(1).join(' / ');
    const artistMatch = artistPart.match(/^(.+?)「/);
    if (artistMatch) {
      artist = artistMatch[1].trim();
    }
    title = kakkoMatch[1];
  } else if (kakkoMatch) {
    // "アーティスト「タイトル」"
    const beforeKakko = fullTitle.match(/^(.+?)「/);
    if (beforeKakko) {
      artist = beforeKakko[1].trim();
    }
    title = kakkoMatch[1];
  }

  return { holder, artist, title };
}

function parseTags(description) {
  const tags = [];
  const desc = description.toLowerCase();

  if (
    desc.includes('レコーディング') ||
    desc.includes('録音') ||
    desc.includes('recording')
  ) {
    tags.push('rec');
  }
  if (
    desc.includes('ミックス') ||
    desc.includes('ミキシング') ||
    desc.includes('mix')
  ) {
    tags.push('mix');
  }
  if (
    desc.includes('マスタリング') ||
    desc.includes('マスター') ||
    desc.includes('mastering')
  ) {
    tags.push('master');
  }

  // Default to mix if no tag found
  if (tags.length === 0) tags.push('mix');

  return tags;
}

function parseTracklist(description) {
  // Look for track patterns like "01. Title" or "01 Title" in the description
  const tracks = [];
  const lines = description.split('\n');
  for (const line of lines) {
    const trackMatch = line.match(/^(\d{1,2})\.\s*(.+)/);
    if (trackMatch) {
      tracks.push({
        number: trackMatch[1].padStart(2, '0'),
        title: trackMatch[2].trim(),
      });
    }
  }
  return tracks;
}

function determineLayout(width, height) {
  if (!width || !height) return 'square';
  const ratio = width / height;
  if (ratio > 1.2) return 'rect-h';
  if (ratio < 0.8) return 'rect-v';
  return 'square';
}

function formatDate(dateStr) {
  // "2026.03.14" → "2026-03-14"
  return dateStr.replace(/\./g, '-');
}

function generateSlug(fullTitle, postId) {
  // Try to create a slug from the title
  let slug = fullTitle
    // Remove 「」『』
    .replace(/[「」『』]/g, ' ')
    // Replace Japanese punctuation
    .replace(/[！？・、。〜～♡☆★♪]/g, ' ')
    // Replace / with space
    .replace(/\//g, ' ')
    // Keep only ASCII alphanumeric, spaces, hyphens
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .toLowerCase()
    // Replace multiple spaces with single hyphen
    .replace(/\s+/g, '-')
    // Replace multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');

  // If slug is too short (mostly Japanese title), use post ID
  if (slug.length < 5) {
    slug = `arte-refact-${postId}`;
  }

  return slug;
}

function getImageExtension(url) {
  const match = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

// ---- Step 4: Download image ----
async function downloadImage(imageUrl, slug) {
  const ext = getImageExtension(imageUrl);
  const filename = `${slug}.${ext}`;
  const filepath = join(MEDIA_DIR, filename);

  if (existsSync(filepath)) {
    console.log(`  Image already exists: ${filename}`);
    return `/works/media/${filename}`;
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(filepath, buffer);
    console.log(`  Downloaded: ${filename}`);
    return `/works/media/${filename}`;
  } catch (err) {
    console.error(`  Failed to download image: ${err.message}`);
    return `/works/media/${filename}`;
  }
}

// ---- Step 5: Generate markdown ----
function generateMarkdown(work) {
  const { holder, artist, title } = parseTitle(work.title);
  const tags = parseTags(work.description || '');
  const layout = determineLayout(work.imgWidth, work.imgHeight);
  const date = formatDate(work.dateStr);
  const slug = work.slug;
  const tracks = parseTracklist(work.description || '');

  let md = `---
published: true
date: "${date}"
holder: "${holder}"
artist: "${artist}"
title: "${title}"
url: "${slug}"
tag:
${tags.map((t) => `  - ${t}`).join('\n')}
layout: "${layout}"
image: "${work.localImage || ''}"
---

`;

  // Tracklist (if tracks found in description)
  if (tracks.length > 0) {
    md += `##### Tracklist

| Track number | Title | Credit |
| ------------ | ----- | ------ |
`;
    const creditMap = { rec: 'Recording', mix: 'Mixing', master: 'Mastering' };
    const creditStr = tags.map((t) => creditMap[t] || t).join(' / ');
    for (const track of tracks) {
      md += `| ${track.number} | ${track.title} | ${creditStr} |\n`;
    }
    md += '\n';
  }

  // YouTube embeds
  if (work.youtubeEmbeds && work.youtubeEmbeds.length > 0) {
    md += `##### Video

`;
    for (const embedUrl of work.youtubeEmbeds) {
      md += `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>\n\n`;
    }
  }

  // Links
  if (work.links && work.links.length > 0) {
    md += `##### Links

`;
    for (const link of work.links) {
      md += `- <a data-type="button" href="${link.url}" target="_blank">${link.label}</a>\n`;
    }
    md += '\n';
  }

  return md;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

// ---- Main ----
async function main() {
  // Ensure directories exist
  if (!existsSync(MEDIA_DIR)) mkdirSync(MEDIA_DIR, { recursive: true });

  console.log('=== Phase 1: Fetching listing pages ===');
  const allWorks = [];
  for (let page = 1; page <= 8; page++) {
    const works = await fetchListingPage(page);
    console.log(`  Page ${page}: ${works.length} works`);
    allWorks.push(...works);
    await sleep(DELAY_MS);
  }
  console.log(`Total works found: ${allWorks.length}`);

  // Deduplicate by postId
  const uniqueWorks = [];
  const seenIds = new Set();
  for (const w of allWorks) {
    if (!seenIds.has(w.postId)) {
      seenIds.add(w.postId);
      uniqueWorks.push(w);
    }
  }
  console.log(`Unique works: ${uniqueWorks.length}`);

  // Generate slugs and check for existing files
  for (const work of uniqueWorks) {
    work.slug = generateSlug(work.title, work.postId);
  }

  console.log('\n=== Phase 2: Fetching detail pages ===');
  let count = 0;
  for (const work of uniqueWorks) {
    count++;
    console.log(
      `[${count}/${uniqueWorks.length}] ${work.title} (${work.postId})`
    );
    try {
      await fetchDetailPage(work);
    } catch (err) {
      console.error(`  Error fetching detail: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  // Save intermediate JSON
  writeFileSync(OUTPUT_JSON, JSON.stringify(uniqueWorks, null, 2));
  console.log(`\nSaved scraped data to ${OUTPUT_JSON}`);

  console.log('\n=== Phase 3: Downloading images ===');
  count = 0;
  for (const work of uniqueWorks) {
    count++;
    if (work.imageUrl) {
      console.log(
        `[${count}/${uniqueWorks.length}] Downloading image for: ${work.slug}`
      );
      work.localImage = await downloadImage(work.imageUrl, work.slug);
      await sleep(100);
    }
  }

  console.log('\n=== Phase 4: Generating markdown files ===');
  let created = 0;
  let skipped = 0;
  for (const work of uniqueWorks) {
    const filename = `${work.slug}.md`;
    const filepath = join(WORKS_DIR, filename);

    if (existsSync(filepath)) {
      console.log(`  Skipped (exists): ${filename}`);
      skipped++;
      continue;
    }

    const markdown = generateMarkdown(work);
    writeFileSync(filepath, markdown);
    console.log(`  Created: ${filename}`);
    created++;
  }

  console.log(`\n=== Done ===`);
  console.log(`Created: ${created}, Skipped: ${skipped}, Total: ${uniqueWorks.length}`);

  // Save final JSON
  writeFileSync(OUTPUT_JSON, JSON.stringify(uniqueWorks, null, 2));
}

main().catch(console.error);
