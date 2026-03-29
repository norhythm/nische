# Code Review: Full Project Review

- **Date:** 2026-03-29
- **Scope:** Full codebase review (app layer, components, lib/utils, config)
- **Status:** Review complete, fixes pending

---

## Critical

### CR-C1: XSS risk — Markdown rendered without sanitization

- **Files:** `lib/markdownToHtml.ts:38-39`, rendered via `dangerouslySetInnerHTML` in 6+ locations
- **Problem:** `allowDangerousHtml: true` + `rehypeRaw` passes raw HTML through without any sanitization. `<script>`, `<img onerror=...>` etc. in markdown will execute in the browser.
- **Risk:** Currently low (author-controlled content), but no defense-in-depth. CMS or external contribution would make this exploitable immediately.
- **Fix:** Add `rehype-sanitize` to the remark/rehype pipeline after `rehypeRaw`. Configure allowlist for needed elements (iframe for YouTube, etc.).
- [ ] Done

### CR-C2: Contact API has no protection

- **File:** `app/api/contact/route.ts`
- **Problem:**
  - No rate limiting (spam relay risk)
  - No CSRF protection
  - No input validation (no length limits, no email format check)
  - `smtpConfig` typed as `any`
  - `zod` is in dependencies but never imported
- **Fix:**
  - Add Zod-based request validation
  - Add rate limiting (in-memory counter or Upstash)
  - Validate email format and enforce field length limits
  - Type `smtpConfig` properly with nodemailer types
- [ ] Done

---

## Important

### CR-I1: prev/next navigation labels are swapped

- **File:** `app/works/[slug]/page.tsx:189,203`
- **Problem:** Left arrow has hidden text "Next work", right arrow has "Previous work". Screen readers announce incorrect navigation direction.
- **Fix:** Swap the labels.
- [ ] Done

### CR-I2: Keyboard navigation fires inside text inputs

- **File:** `components/keyboard-navigation.tsx:20-25`
- **Problem:** ArrowLeft/ArrowRight handler does not check if the active element is an input, textarea, or contenteditable. Pressing arrow keys in the contact form triggers page navigation.
- **Fix:** Add guard to skip navigation when focus is on form elements.
- [ ] Done

### CR-I3: Touch swipe conflicts with page scrolling

- **File:** `components/keyboard-navigation.tsx:57-60`
- **Problem:** Touch listeners attached to `document`. Any horizontal swipe (even during vertical scroll) triggers navigation. No vertical vs horizontal discrimination.
- **Fix:** Only trigger navigation when `Math.abs(diffX) > 2 * Math.abs(diffY)`.
- [ ] Done

### CR-I4: SVG clipPath ID collision

- **File:** `components/tiltImage.tsx:105`
- **Problem:** `clip-mask` is hardcoded. Multiple TiltImage components with `clip={true}` on the same page will share the same ID, causing incorrect rendering.
- **Fix:** Use `useId()` to generate unique IDs per instance.
- [ ] Done

### CR-I5: Tag.tsx Link + onClick double handling

- **File:** `components/Tag.tsx:27-30`
- **Problem:** `<Link>` has an `onClick` that calls `e.preventDefault()` + `router.push()` to the same URL. This breaks prefetching, right-click "Open in new tab", and accessibility.
- **Fix:** Remove `onClick` handler and `useRouter` import. Let `<Link>` handle navigation natively.
- [ ] Done

### CR-I6: Unused dependencies

- **File:** `package.json`
- **Problem:** Multiple production dependencies are installed but never imported:
  - `date-fns` — zero imports
  - `class-variance-authority` — zero imports
  - `zod` — zero imports (should be used in CR-C2 fix)
  - `remark-html` — not used (pipeline uses remark-rehype)
  - `remark-parse` — redundant (implicit via remark)
  - `rehype-prism` — not used (`rehype-prism-plus` used instead)
  - `next-themes` — only imported in `components/theme-provider.tsx`, which is never imported anywhere
- **Fix:** Remove unused packages. Keep `zod` if used for CR-C2. Remove `theme-provider.tsx` dead code.
- [ ] Done

### CR-I7: Dual scroll restoration systems

- **Files:** `lib/scroll-restoration.tsx`, `next.config.mjs:11`
- **Problem:** Custom scroll restoration component AND Next.js `experimental.scrollRestoration: true` are both active. They will compete.
- **Fix:** Choose one. Remove the other.
- [ ] Done

### CR-I8: Debug console.log in production

- **File:** `lib/scroll-restoration.tsx:57-61`
- **Problem:** `console.log("[ScrollRestoration] ...")` statements will appear in production browser console.
- **Fix:** Remove or gate behind `process.env.NODE_ENV !== "production"`.
- [ ] Done

### CR-I9: Unsafe `as Post` type cast without validation

- **File:** `lib/api.ts:51,72`
- **Problem:** Frontmatter from `gray-matter` is cast to `Post` without verifying required fields exist. Incomplete markdown files cause unclear runtime errors.
- **Fix:** Add runtime validation (Zod schema) or guard with required field checks that name the offending file.
- [ ] Done

### CR-I10: Invalid function parameter `modal: false`

- **File:** `app/works/[slug]/page.tsx:25`
- **Problem:** `export default async function Post(props: Params, modal: false)` — second parameter is never passed by Next.js. Dead code from a removed feature.
- **Fix:** Remove the second parameter.
- [ ] Done

### CR-I11: Stale closure — onTap callback causes effect churn

- **File:** `components/mobile-touch-cursor.tsx:147`
- **Problem:** `handleBack` in `back-component.tsx` is recreated every render (no `useCallback`). This causes the touch event effect to tear down and re-attach all listeners on every render.
- **Fix:** Wrap `handleBack` with `useCallback`, or use a ref for the latest callback inside `mobile-touch-cursor.tsx`.
- [ ] Done

### CR-I12: Tailwind safelist entries have invalid leading dots

- **File:** `tailwind.config.ts:14-17`
- **Problem:** Entries like `.md:pt-10` have a leading dot. Tailwind safelist expects class names without dots.
- **Fix:** Remove leading dots (e.g., `.md:pt-10` -> `md:pt-10`).
- [ ] Done

---

## Minor

### CR-M1: Unused imports in works page

- **File:** `app/works/[slug]/page.tsx`
- **Problem:** `Image` from `next/image` and `ArticleBody` are imported but never used. `fillRectColor` is defined but never called.
- [ ] Done

### CR-M2: Invalid Tailwind class names

- **Files:** `app/not-found.tsx:15` (`border-color`), `app/contact/contact-form.tsx:144` (`border-gray-[#ddd]`)
- **Problem:** `border-color` is not a Tailwind utility. `border-gray-[#ddd]` should be `border-[#ddd]`.
- [ ] Done

### CR-M3: Google Fonts loaded via `<link>` instead of `next/font`

- **File:** `app/layout.tsx:46-51`
- **Problem:** External `<link>` creates render-blocking request. `next/font/google` enables self-hosting and optimization.
- [ ] Done

### CR-M4: Empty ternary expressions (dead code)

- **Files:** `components/header.tsx:33-34`, `components/mobile-touch-cursor.tsx:162-164`
- **Problem:** `pathname === "/biography" ? "" : ""` and `isPressed ? "" : ""` — both branches produce empty strings.
- [ ] Done

### CR-M5: Local `FormData` shadows global Web API

- **File:** `app/contact/contact-form.tsx:5`
- **Problem:** Local interface `FormData` shadows browser's `FormData`. Rename to `ContactFormData`.
- [ ] Done

### CR-M6: Mismatched email addresses in contact.json

- **File:** `data/contact.json`
- **Problem:** Display text shows `mail@nische.jp` but mailto link points to `tsukasa.kikuchi@arte-refact.com`.
- **Action:** Confirm intentional or align addresses.
- [ ] Done

### CR-M7: CLAUDE.md references non-existent `data/works.json`

- **File:** `CLAUDE.md:20,33`
- **Problem:** Documentation references a file that does not exist.
- [ ] Done

### CR-M8: Package name is scaffold default

- **File:** `package.json:2`
- **Problem:** `"name": "my-v0-project"` — should be `nische` or similar.
- [ ] Done

### CR-M9: TypeScript build errors ignored

- **File:** `next.config.mjs:4-6`
- **Problem:** `ignoreBuildErrors: true` nullifies `strict: true` during builds.
- [ ] Done

### CR-M10: `getPostSlugs()` unused and misleadingly named

- **File:** `lib/api.ts:24-26`
- **Problem:** Returns filenames, not slugs. No callers found.
- [ ] Done

### CR-M11: Unused `useRouter` import

- **File:** `lib/url-state.ts:2`
- [ ] Done

### CR-M12: Non-passive touch listeners without `preventDefault`

- **File:** `components/mobile-touch-cursor.tsx:131`
- **Problem:** `{ passive: false }` but handler never calls `preventDefault`. Degrades scroll performance.
- [ ] Done

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| Important | 12 |
| Minor | 12 |
| **Total** | **26** |

## Recommended Order

1. **CR-C1, CR-C2** — Security first
2. **CR-I1 ~ CR-I5** — UX/accessibility
3. **CR-I6** — Dependency cleanup
4. **CR-I7 ~ CR-I12** — Code quality
5. **CR-M1 ~ CR-M12** — Polish
