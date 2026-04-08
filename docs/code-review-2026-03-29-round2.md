# Code Review: Second Round (Post-Fix Re-Review)

- **Date:** 2026-03-29
- **Scope:** Full codebase re-review after 23 fixes from Round 1
- **Status:** Resolved (19/20 fixed, 1 deferred)

---

## Critical

### CR2-C1: iframe src has no domain restriction in sanitizer

- **File:** `lib/markdownToHtml.ts:17-50`
- **Problem:** Sanitizer allows `<iframe>` with any HTTPS `src`. Non-YouTube iframes pass through. Phishing/clickjacking risk.
- **Fix:** Add a custom rehype plugin to strip iframes whose `src` does not match allowlisted embed domains (youtube.com, youtube-nocookie.com, soundcloud.com, spotify.com, music.apple.com).
- [x] Done — `33ac31c2`

### CR2-C2: `style` attribute allowed on all elements via sanitizer wildcard

- **File:** `lib/markdownToHtml.ts:29`
- **Problem:** `"style"` in `"*"` wildcard allows CSS-based UI redressing/tracking on any element. Undermines sanitization purpose.
- **Fix:** Remove `"style"` from `"*"`. Only allow on specific elements if needed (e.g., iframe for width/height).
- [x] Done — `33ac31c2`

---

## Important

### CR2-I1: Rate limiter memory leak

- **File:** `app/api/contact/route.ts:15`
- **Problem:** `rateLimitMap` grows indefinitely. Expired entries never deleted.
- **Fix:** Add lazy cleanup when map exceeds threshold.
- [x] Done — `6a0de876`

### CR2-I2: getAllPosts reads all files redundantly (O(n^2) build I/O)

- **File:** `lib/api.ts`
- **Problem:** `getPostBySlug` + `getAdjacentPosts` scan all 456 files 3 times per page. ~620K file reads during SSG.
- **Fix:** Cache `getAllPosts` result at module level.
- [x] Done — `6a0de876`

### CR2-I3: generateMetadata calls notFound() incorrectly

- **File:** `app/works/[slug]/page.tsx:227`
- **Problem:** `notFound()` throws in a metadata function. Should return fallback metadata.
- **Fix:** Return `{ title: 'Not Found' }` instead.
- [x] Done — `cb77e347`

### CR2-I4: tagName function duplicated in two files

- **Files:** `app/top.tsx:95-106`, `components/Tag.tsx:10-21`
- **Problem:** Identical switch statement in two places.
- **Fix:** Extract to `lib/utils.ts`.
- [x] Done — `cb77e347`

### CR2-I5: tiltImage mousemove causes 60fps re-renders via setState

- **File:** `components/tiltImage.tsx`
- **Problem:** `setTransform()` on every mousemove triggers React re-render. Purely visual effect.
- **Fix:** Use ref-based DOM mutation instead of state.
- [x] Done — `cb77e347`

### CR2-I6: Clickable overlay div has no keyboard accessibility

- **File:** `components/back-component.tsx:48-52`
- **Problem:** Full-screen click overlay has no role, tabIndex, aria-label, or keyboard handler.
- **Fix:** Add `aria-hidden="true"` since keyboard close is handled elsewhere.
- [x] Done — `1e1b25ab`

### CR2-I7: `hidden` class hides text from screen readers too

- **Files:** `components/back-component.tsx:59`, `app/works/[slug]/page.tsx:182,196`
- **Problem:** `className="hidden"` = `display:none`, invisible to screen readers. Should use `sr-only`.
- **Fix:** Replace `hidden` with `sr-only` for accessibility text.
- [x] Done — `1e1b25ab`

### CR2-I8: `cn()` utility is dead code with unused deps

- **File:** `lib/utils.ts`
- **Problem:** `cn()` wrapping clsx + tailwind-merge is never imported. Both packages are unused.
- **Fix:** Remove `cn()`, remove `clsx` and `tailwind-merge` packages.
- [x] Done — `1e1b25ab`

### CR2-I9: blendMode state is dead code

- **File:** `components/tiltImage.tsx:98-99, 255-268`
- **Problem:** `blendMode`/`setBlendMode` state never changes (UI commented out). Always "multiply".
- **Fix:** Remove state, hardcode "multiply", remove commented-out select.
- [x] Done — `cb77e347`

---

## Minor

### CR2-M1: Duplicate `<h1>` tags (desktop/mobile)

- **File:** `app/works/[slug]/page.tsx:67,127`
- [x] Done — `563b130a`

### CR2-M2: `url-state.ts` missing `"use client"` directive

- **File:** `lib/url-state.ts`
- [x] Done — `563b130a`

### CR2-M3: WorkNavLink is a trivial unnecessary wrapper

- **File:** `components/work-nav-link.tsx`
- [x] Done — `563b130a` (deleted, replaced with direct Link usage)

### CR2-M4: Unused shadcn/ui boilerplate in Tailwind config

- **File:** `tailwind.config.ts`
- [ ] Deferred — needs broader cleanup assessment

### CR2-M5: `equipmentsGroup` uses `any` type

- **File:** `app/biography/biography.tsx:7`
- [x] Done — `563b130a`

### CR2-M6: path-aware-container hydration flash

- **File:** `components/path-aware-container.tsx:14`
- [x] Done — `563b130a`

### CR2-M7: onTap ref pattern to avoid effect re-runs

- **File:** `components/mobile-touch-cursor.tsx:39`
- [x] Done — `563b130a`

### CR2-M8: `rehype-slug` possibly unused

- **File:** `lib/markdownToHtml.ts:5`
- [x] Done — `563b130a` (confirmed unused, removed)

### CR2-M9: Form status has no success/error visual distinction

- **File:** `app/contact/contact-form.tsx:150`
- [x] Done — `563b130a`

---

## Summary

| Severity | Count | Fixed | Deferred |
|----------|-------|-------|----------|
| Critical | 2 | 2 | 0 |
| Important | 9 | 9 | 0 |
| Minor | 9 | 8 | 1 |
| **Total** | **20** | **19** | **1** |

### Deferred
- **CR2-M4** (Tailwind config shadcn/ui boilerplate): Requires broader cleanup to determine what's actively used vs. scaffold leftover
