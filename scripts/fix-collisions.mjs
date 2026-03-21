import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKS_DIR = join(__dirname, '..', '_works');
const MEDIA_DIR = join(__dirname, '..', 'public', 'works', 'media');
const SCRAPED_JSON = join(__dirname, 'scraped-works.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Load scraped data
const allWorks = JSON.parse(
  (await import('fs')).readFileSync(SCRAPED_JSON, 'utf8')
);

function generateSlug(fullTitle, postId) {
  let slug = fullTitle
    .replace(/[「」『』]/g, ' ')
    .replace(/[！？・、。〜～♡☆★♪]/g, ' ')
    .replace(/\//g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (slug.length < 5) {
    slug = `arte-refact-${postId}`;
  }

  return slug;
}

function getImageExtension(url) {
  const match = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function downloadImage(imageUrl, slug) {
  const ext = getImageExtension(imageUrl);
  const filename = `${slug}.${ext}`;
  const filepath = join(MEDIA_DIR, filename);

  if (existsSync(filepath)) {
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

function parseTitle(fullTitle) {
  let holder = '';
  let artist = '';
  let title = fullTitle;

  const kakkoMatch = fullTitle.match(/「([^」]+)」/);
  const kagikakkoMatch = fullTitle.match(/『([^』]+)』/);

  if (kagikakkoMatch) {
    holder = kagikakkoMatch[1];
    if (kakkoMatch) {
      title = kakkoMatch[1];
      const betweenMatch = fullTitle.match(/』\s*(.+?)\s*「/);
      if (betweenMatch) {
        const between = betweenMatch[1].trim();
        if (
          between &&
          !between.match(
            /^(THIRD|SEASON|第|ED|OP|主題歌|挿入歌|エンディング)/
          )
        ) {
          artist = between;
        }
      }
    } else {
      const afterMatch = fullTitle.match(/』\s*(.+)/);
      if (afterMatch) {
        title = afterMatch[1].trim();
      }
    }
  } else if (fullTitle.includes(' / ') && kakkoMatch) {
    const slashParts = fullTitle.split(' / ');
    holder = slashParts[0].trim();
    const artistPart = slashParts.slice(1).join(' / ');
    const artistMatch = artistPart.match(/^(.+?)「/);
    if (artistMatch) {
      artist = artistMatch[1].trim();
    }
    title = kakkoMatch[1];
  } else if (fullTitle.includes('/ ') && kakkoMatch) {
    const slashParts = fullTitle.split('/ ');
    holder = slashParts[0].trim();
    const artistPart = slashParts.slice(1).join('/ ');
    const artistMatch = artistPart.match(/^(.+?)「/);
    if (artistMatch) {
      artist = artistMatch[1].trim();
    }
    title = kakkoMatch[1];
  } else if (kakkoMatch) {
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
  const desc = (description || '').toLowerCase();

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

  if (tags.length === 0) tags.push('mix');
  return tags;
}

function parseTracklist(description) {
  const tracks = [];
  const lines = (description || '').split('\n');
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
  return (dateStr || '').replace(/\./g, '-');
}

function generateMarkdown(work) {
  const { holder, artist, title } = parseTitle(work.title);
  const tags = parseTags(work.description);
  const layout = determineLayout(work.imgWidth, work.imgHeight);
  const date = formatDate(work.dateStr);
  const slug = work.slug;
  const tracks = parseTracklist(work.description);

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

  if (tracks.length > 0) {
    md += `##### Tracklist\n\n`;
    md += `| Track number | Title | Credit |\n`;
    md += `| ------------ | ----- | ------ |\n`;
    const creditMap = { rec: 'Recording', mix: 'Mixing', master: 'Mastering' };
    const creditStr = tags.map((t) => creditMap[t] || t).join(' / ');
    for (const track of tracks) {
      md += `| ${track.number} | ${track.title} | ${creditStr} |\n`;
    }
    md += '\n';
  }

  if (work.youtubeEmbeds && work.youtubeEmbeds.length > 0) {
    md += `##### Video\n\n`;
    for (const embedUrl of work.youtubeEmbeds) {
      md += `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>\n\n`;
    }
  }

  if (work.links && work.links.length > 0) {
    md += `##### Links\n\n`;
    for (const link of work.links) {
      md += `- <a data-type="button" href="${link.url}" target="_blank">${link.label}</a>\n`;
    }
    md += '\n';
  }

  return md;
}

// ---- Main: Fix slug collisions ----
// First, get all existing file names from before the initial run
// (works that already existed in the repo)
const preExistingFiles = new Set();
// We know these existed from the git status (they were already in _works before scraping)
// Let's just focus on finding works that weren't created due to slug collision

// Build slug map to detect collisions
const slugMap = new Map(); // slug -> [works]
for (const work of allWorks) {
  const baseSlug = generateSlug(work.title, work.postId);
  if (!slugMap.has(baseSlug)) {
    slugMap.set(baseSlug, []);
  }
  slugMap.get(baseSlug).push(work);
}

// For colliding slugs, append the post ID
let fixCount = 0;
for (const [slug, works] of slugMap) {
  if (works.length > 1) {
    // Multiple works have the same slug - fix them
    for (const work of works) {
      const newSlug = `${slug}-${work.postId}`;
      const filepath = join(WORKS_DIR, `${newSlug}.md`);

      if (existsSync(filepath)) {
        console.log(`  Already exists: ${newSlug}.md`);
        continue;
      }

      // Check if this work was already created with the old slug
      const oldFilepath = join(WORKS_DIR, `${slug}.md`);
      // We'll create the new file regardless

      work.slug = newSlug;

      // Download image with new slug if needed
      if (work.imageUrl) {
        work.localImage = await downloadImage(work.imageUrl, newSlug);
        await sleep(100);
      }

      const markdown = generateMarkdown(work);
      writeFileSync(filepath, markdown);
      console.log(`  Created: ${newSlug}.md (was collision: ${slug}.md)`);
      fixCount++;
    }
  }
}

console.log(`\nFixed ${fixCount} slug collisions`);

// Clean up the collision files that only have one entry (the first one got it)
// The original file might be wrong if it was created from the first colliding work
// Let's leave them and let the user review
console.log(
  '\nNote: Original collision files (e.g., vtuber.md, tv-bgm.md) still exist.'
);
console.log(
  'You may want to review and delete them if they are duplicates of the new -POSTID files.'
);
