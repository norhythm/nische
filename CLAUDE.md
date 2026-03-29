# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website for Tsukasa Kikuchi, a professional audio engineer. The site showcases audio engineering work including recording, mixing, and mastering projects. The site is built with React 19, TypeScript, and Tailwind CSS.

## Development Commands

- `pnpm dev` or `npm run dev` - Start development server on localhost:3000
- `pnpm build` or `npm run build` - Build production version
- `pnpm start` or `npm run start` - Start production server
- `pnpm lint` or `npm run lint` - Run ESLint (Note: build ignores ESLint and TypeScript errors via next.config.mjs)

## Architecture

### Content Management
- **Posts/Works**: Stored as markdown files in `_works/` directory (currently empty but structure exists)
- **Images**: Work images stored in `public/works/media/` directory
- **Content API**: `lib/api.ts` handles reading and parsing markdown files using gray-matter

### Key Components
- **Layout**: Standard Next.js app router layout in `app/layout.tsx` with Header/Footer
- **Homepage**: `app/top.tsx` (client component) renders filterable work portfolio with tag-based filtering
- **Work Detail**: `app/works/[slug]/page.tsx` generates static pages for individual works
- **Header**: Navigation with Biography and Contact links
- **Footer**: Standard footer component

### Data Flow
1. Works can be managed through markdown files in `_works/` (using frontmatter for metadata)
2. Images must be placed in `public/works/media/` and referenced by filename
3. Tags are used for filtering: "recording", "mixing", "mastering"

### Styling
- Tailwind CSS for styling
- Custom CSS modules for markdown content (`app/markdown.module.css`) and arrangements (`app/arrange.module.css`)
- Google Fonts: Barlow and M PLUS Rounded 1c
- Japanese language support (lang="ja" in html tag)

### Special Configuration
- Images are unoptimized (Next.js config)
- Build process ignores ESLint and TypeScript errors
- SEO robots are disabled (noindex, nofollow, etc.)

## TypeScript Types
- `Post` interface in `interfaces/post.ts` defines work/post structure
- Includes fields: slug, url, title, date, image, tag, layout, content, published

## Package Manager
Uses pnpm (pnpm-lock.yaml present) but npm commands also work.