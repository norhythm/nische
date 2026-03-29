# Code Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 26 issues identified in the 2026-03-29 full code review, prioritized by severity (Critical > Important > Minor).

**Architecture:** Targeted, surgical fixes to existing files. No new features. No structural changes. Each task touches a small set of related files. Build verification after each batch.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Zod (already installed), rehype-sanitize (to install)

**Note:** This project has no test infrastructure. Verification is via `pnpm build` and manual spot checks. Setting up a test suite is out of scope for this plan.

---

## Batch 1: Critical — Security

### Task 1: Add HTML sanitization to markdown pipeline (CR-C1)

**Files:**
- Modify: `lib/markdownToHtml.ts`

- [ ] **Step 1: Install rehype-sanitize**

```bash
pnpm add rehype-sanitize
```

- [ ] **Step 2: Add rehype-sanitize to the pipeline**

In `lib/markdownToHtml.ts`, add the import and insert `rehypeSanitize` with a custom schema after `rehypeRaw`:

```typescript
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Custom schema: allow everything defaultSchema allows, plus iframes (YouTube) and data attributes
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "iframe",
    "div",
    "span",
    "section",
  ],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ["src", "width", "height", "frameBorder", "allow", "allowFullScreen", "title", "style"],
    div: [...(defaultSchema.attributes?.div || []), "className", "class", "style"],
    span: [...(defaultSchema.attributes?.span || []), "className", "class", "style", "data*"],
    "*": [...(defaultSchema.attributes?.["*"] || []), "className", "class", "id"],
  },
};
```

Insert `.use(rehypeSanitize, sanitizeSchema)` after `.use(rehypeRaw)` (line 39) and before `.use(rehypeWrapYouTubeIframe)`.

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

Expected: Build completes. Spot-check a work detail page to ensure markdown content (including YouTube embeds) renders correctly.

- [ ] **Step 4: Commit**

```bash
git add lib/markdownToHtml.ts package.json pnpm-lock.yaml
git commit -m "fix: add rehype-sanitize to markdown pipeline for XSS protection"
```

---

### Task 2: Secure Contact API with validation and rate limiting (CR-C2)

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Add Zod validation and basic rate limiting**

Replace the entire file with:

```typescript
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod/v4";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email().max(254),
  subject: z.string().max(500).optional().default(""),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "送信回数の制限に達しました。しばらくしてから再度お試しください。" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "入力内容に不備があります。全てのフィールドを正しく入力してください。" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    const isProduction = process.env.NODE_ENV === "production";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpConfig: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      smtpConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    const envLabel = isProduction ? "" : " [開発環境]";
    const devNotice = !isProduction
      ? "[開発環境テスト] このメールは開発環境から送信されました。\n\n"
      : "";

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `ポートフォリオサイトからのお問い合わせ${envLabel} - ${subject || "(件名なし)"} ${name}`,
      text: `${devNotice}お名前: ${name}\nメールアドレス: ${email}\n件名: ${subject || "(件名なし)"}\n\nメッセージ:\n${message}\n\n---\nこのメールはポートフォリオサイトのお問い合わせフォームから送信されました。`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "メールが正常に送信されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "fix: add input validation and rate limiting to contact API"
```

---

## Batch 2: Important — UX & Accessibility

### Task 3: Fix works detail page issues (CR-I1, CR-I10, CR-M1)

**Files:**
- Modify: `app/works/[slug]/page.tsx`

- [ ] **Step 1: Fix swapped prev/next labels (lines 189, 203)**

Change line 189 from:
```tsx
<span className="hidden">← Next work</span>
```
to:
```tsx
<span className="hidden">← Previous work</span>
```

Change line 203 from:
```tsx
<span className="hidden">Previous work →</span>
```
to:
```tsx
<span className="hidden">Next work →</span>
```

- [ ] **Step 2: Remove invalid `modal: false` parameter (line 25)**

Change:
```typescript
export default async function Post(props: Params, modal: false) {
```
to:
```typescript
export default async function Post(props: Params) {
```

- [ ] **Step 3: Remove unused imports and dead code**

Remove these lines at the top:
- Line 5: `import Image from "next/image";` (unused)
- Line 13: `import ArticleBody from "@/components/article-body";` (unused)

Remove lines 21-23 (unused `fillRectColor` function):
```typescript
const fillRectColor = () => {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 68%)`;
};
```

- [ ] **Step 4: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add app/works/[slug]/page.tsx
git commit -m "fix: correct prev/next labels, remove dead code in works detail page"
```

---

### Task 4: Fix keyboard navigation issues (CR-I2, CR-I3)

**Files:**
- Modify: `components/keyboard-navigation.tsx`

- [ ] **Step 1: Add form element guard and horizontal swipe detection**

Replace the entire `handleKeyDown` function (lines 20-26) with:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || target.isContentEditable) {
    return;
  }

  if (e.key === "ArrowLeft" && prevUrl) {
    router.push(prevUrl);
  } else if (e.key === "ArrowRight" && nextUrl) {
    router.push(nextUrl);
  }
};
```

- [ ] **Step 2: Add vertical movement tracking and horizontal-only swipe detection**

Add a `touchStartY` ref alongside the existing refs:
```typescript
const touchStartY = useRef<number | null>(null);
const touchEndY = useRef<number | null>(null);
```

Update `handleTouchStart`:
```typescript
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
  touchStartY.current = e.touches[0].clientY;
  touchEndX.current = null;
  touchEndY.current = null;
};
```

Update `handleTouchMove`:
```typescript
const handleTouchMove = (e: TouchEvent) => {
  touchEndX.current = e.touches[0].clientX;
  touchEndY.current = e.touches[0].clientY;
};
```

Update `handleTouchEnd`:
```typescript
const handleTouchEnd = () => {
  if (touchStartX.current === null || touchEndX.current === null) return;

  const diffX = touchStartX.current - touchEndX.current;
  const diffY = (touchStartY.current ?? 0) - (touchEndY.current ?? 0);
  const threshold = 100;

  // Only navigate if swipe is predominantly horizontal
  if (Math.abs(diffX) > threshold && Math.abs(diffX) > 2 * Math.abs(diffY)) {
    if (diffX > 0 && nextUrl) {
      router.push(nextUrl);
    } else if (diffX < 0 && prevUrl) {
      router.push(prevUrl);
    }
  }

  touchStartX.current = null;
  touchStartY.current = null;
  touchEndX.current = null;
  touchEndY.current = null;
};
```

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add components/keyboard-navigation.tsx
git commit -m "fix: prevent keyboard nav in inputs, require horizontal swipe for page nav"
```

---

### Task 5: Fix SVG clipPath ID collision (CR-I4) and dead state in tiltImage (CR-I5 partial)

**Files:**
- Modify: `components/tiltImage.tsx`

- [ ] **Step 1: Use `useId()` for unique clipPath ID**

Add `useId` to the import on line 3:
```typescript
import { useState, useEffect, useRef, useCallback, useId } from "react";
```

Replace line 105:
```typescript
const maskId = `clip-mask`;
```
with:
```typescript
const reactId = useId();
const maskId = `clip-mask-${reactId}`;
```

- [ ] **Step 2: Remove dead `imageRatio` state and `blendOptions` array**

Remove line 98:
```typescript
const [imageRatio, setImageRatio] = useState(`${width} / ${height}`);
```

Remove lines 107-124 (the entire `blendOptions` array).

Remove the `setImageRatio` call inside the `onLoad` handler (line 265):
```typescript
setImageRatio(`${img.clientWidth} / ${img.clientHeight}`);
```
Keep just `setLoaded(true)`.

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add components/tiltImage.tsx
git commit -m "fix: use unique IDs for SVG clipPath, remove dead state"
```

---

### Task 6: Fix Tag.tsx redundant onClick (CR-I5)

**Files:**
- Modify: `components/Tag.tsx`

- [ ] **Step 1: Remove onClick handler and useRouter**

Replace the entire file content with:

```typescript
"use client";

import Link from "next/link";

interface TagProps {
  tag: string;
  classNames?: string;
}

const tagName = (tag: string) => {
  switch (tag) {
    case "rec":
      return "recording";
    case "mix":
      return "mixing";
    case "master":
      return "mastering";
    default:
      return tag;
  }
};

export default function Tag({ tag, classNames = "" }: TagProps) {
  return (
    <Link
      className={`text-[#888] hover:text-[#aaa] text-xs md:text-sm capitalize transition ${classNames}`}
      href={`/?tag=${tag}`}
    >
      {tagName(tag)}
    </Link>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/Tag.tsx
git commit -m "fix: let Link handle navigation natively in Tag component"
```

---

## Batch 3: Important — Code Quality

### Task 7: Fix stale closure in back-component (CR-I11)

**Files:**
- Modify: `components/back-component.tsx`

- [ ] **Step 1: Wrap handleBack with useCallback**

Add `useCallback` to imports:
```typescript
import { useRouter } from "next/navigation";
import { Suspense, useCallback } from "react";
```

Replace the `handleBack` function:
```typescript
const handleBack = useCallback(() => {
  const prevPath = getPrevPath();

  if (prevPath === "/") {
    window.history.back();
  } else {
    if (selectedTag) {
      router.push(`/?tag=${selectedTag}`);
    } else {
      router.push("/");
    }
  }
}, [selectedTag, router]);
```

- [ ] **Step 2: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/back-component.tsx
git commit -m "fix: stabilize handleBack with useCallback to prevent effect churn"
```

---

### Task 8: Fix scroll restoration and remove debug logging (CR-I7, CR-I8)

**Files:**
- Modify: `lib/scroll-restoration.tsx`
- Modify: `next.config.mjs`

- [ ] **Step 1: Remove debug console.log statements**

In `lib/scroll-restoration.tsx`, remove lines 57 and 60:
```typescript
console.log("[ScrollRestoration] pathname changed:", pathname, "prev:", prevPathname.current);
```
and:
```typescript
console.log("[ScrollRestoration] saved prevPath:", prevPathname.current);
```

- [ ] **Step 2: Remove competing experimental.scrollRestoration**

In `next.config.mjs`, remove the `experimental` block entirely (lines 10-12):
```javascript
experimental: {
  scrollRestoration: true,
},
```

The custom `ScrollRestoration` component handles this already.

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add lib/scroll-restoration.tsx next.config.mjs
git commit -m "fix: remove debug logging and competing scroll restoration config"
```

---

### Task 9: Fix frontmatter validation and remove dead code in api.ts (CR-I9, CR-M10)

**Files:**
- Modify: `lib/api.ts`

- [ ] **Step 1: Remove unused `getPostSlugs` function (lines 24-26)**

Delete:
```typescript
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}
```

- [ ] **Step 2: Add validation guard for required frontmatter fields**

Add after the `sortTags` function:

```typescript
function validatePostData(data: Record<string, unknown>, fileName: string): void {
  const required = ["url", "title", "date", "image", "layout"] as const;
  const missing = required.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter fields [${missing.join(", ")}] in ${fileName}`
    );
  }
}
```

Call it in `getPostBySlug` before the return (after line 40 `if (data.url === slug)`):
```typescript
validatePostData(data, fileName);
```

Call it in `getAllPosts` inside the `.map()` before the return:
```typescript
validatePostData(data, fileName);
```

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add lib/api.ts
git commit -m "fix: add frontmatter validation, remove unused getPostSlugs"
```

---

### Task 10: Fix Tailwind safelist (CR-I12)

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Remove leading dots from safelist entries**

Change lines 11-18 from:
```typescript
safelist: [
  "size-full",
  "py-12",
  ".md:pt-10",
  ".md:w-6/12",
  ".md:w-8/12",
  ".md:w-7/12",
],
```
to:
```typescript
safelist: [
  "size-full",
  "py-12",
  "md:pt-10",
  "md:w-6/12",
  "md:w-8/12",
  "md:w-7/12",
],
```

- [ ] **Step 2: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "fix: remove invalid leading dots from Tailwind safelist"
```

---

### Task 11: Remove unused dependencies and dead code (CR-I6)

**Files:**
- Modify: `package.json`
- Delete: `components/theme-provider.tsx`

- [ ] **Step 1: Remove unused production dependencies**

```bash
pnpm remove date-fns class-variance-authority remark-html remark-parse rehype-prism next-themes
```

Note: Keep `zod` — it is now used in the contact API (Task 2).

- [ ] **Step 2: Delete dead theme-provider component**

```bash
rm components/theme-provider.tsx
```

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml components/theme-provider.tsx
git commit -m "chore: remove unused dependencies and dead theme-provider"
```

---

## Batch 4: Minor — Polish

### Task 12: Fix invalid Tailwind classes (CR-M2)

**Files:**
- Modify: `app/not-found.tsx`
- Modify: `app/contact/contact-form.tsx`

- [ ] **Step 1: Fix not-found.tsx (line 15)**

Change:
```tsx
className="inline-block mt-8 px-6 py-2 border border-color border-gray-[#ddd] transition-colors hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```
to:
```tsx
className="inline-block mt-8 px-6 py-2 border border-[#ddd] transition-colors hover:border-gray-800 cursor-pointer"
```

(Removed invalid `border-color`, fixed `border-gray-[#ddd]` to `border-[#ddd]`, removed `disabled:` classes that don't apply to a Link.)

- [ ] **Step 2: Fix contact-form.tsx border classes**

In `contact-form.tsx`, replace all 4 occurrences of `border-gray-[#ddd]` with `border-[#ddd]`:
- Line 90: input (name)
- Line 105: input (email)
- Line 120: input (subject)
- Line 135: textarea (message)

And on line 144 (submit button), change:
```tsx
className="px-6 py-2 border border-color border-gray-[#ddd] transition-colors hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```
to:
```tsx
className="px-6 py-2 border border-[#ddd] transition-colors hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```

(Removed invalid `border-color`.)

- [ ] **Step 3: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx app/contact/contact-form.tsx
git commit -m "fix: correct invalid Tailwind border class names"
```

---

### Task 13: Fix remaining minor issues (CR-M4, CR-M5, CR-M8, CR-M11, CR-M12, CR-M15)

**Files:**
- Modify: `components/header.tsx`
- Modify: `components/mobile-touch-cursor.tsx`
- Modify: `app/contact/contact-form.tsx`
- Modify: `lib/url-state.ts`
- Modify: `package.json`

- [ ] **Step 1: Remove empty ternaries in header.tsx (lines 33, 46)**

Change line 32-34:
```tsx
className={`hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto ${
  pathname === "/biography" ? "" : ""
}`}
```
to:
```tsx
className="hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto"
```

Same for lines 45-47 (contact link):
```tsx
className={`hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto ${
  pathname === "/contact" ? "" : ""
}`}
```
to:
```tsx
className="hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto"
```

- [ ] **Step 2: Fix mobile-touch-cursor.tsx — empty ternary and passive listeners**

Change line 161-163:
```tsx
className={`w-16 h-16 rounded-full backdrop-blur-sm bg-close transition-all duration-150 ${
  isPressed ? "" : ""
}`}
```
to:
```tsx
className="w-16 h-16 rounded-full backdrop-blur-sm bg-close transition-all duration-150"
```

Change lines 131-134 from:
```typescript
layer.addEventListener("touchstart", handleTouchStart, {
  passive: false,
});
layer.addEventListener("touchmove", handleTouchMove, { passive: false });
```
to:
```typescript
layer.addEventListener("touchstart", handleTouchStart, { passive: true });
layer.addEventListener("touchmove", handleTouchMove, { passive: true });
```

- [ ] **Step 3: Rename FormData to ContactFormData in contact-form.tsx**

Change line 5:
```typescript
interface FormData {
```
to:
```typescript
interface ContactFormData {
```

Change line 17:
```typescript
const [form, setForm] = useState<FormData>({
```
to:
```typescript
const [form, setForm] = useState<ContactFormData>({
```

Also fix the unnecessary template literal on line 44:
```typescript
message: `${form.message}`,
```
to:
```typescript
message: form.message,
```

- [ ] **Step 4: Remove unused `useRouter` import in url-state.ts**

In `lib/url-state.ts`, change line 2 from:
```typescript
import { useRouter, useSearchParams } from "next/navigation";
```
to:
```typescript
import { useSearchParams } from "next/navigation";
```

- [ ] **Step 5: Fix package name**

In `package.json`, change line 2 from:
```json
"name": "my-v0-project",
```
to:
```json
"name": "nische",
```

- [ ] **Step 6: Verify build succeeds**

```bash
pnpm build
```

- [ ] **Step 7: Commit**

```bash
git add components/header.tsx components/mobile-touch-cursor.tsx app/contact/contact-form.tsx lib/url-state.ts package.json
git commit -m "fix: clean up empty ternaries, invalid classes, unused imports, package name"
```

---

### Task 14: Update CLAUDE.md to remove stale references (CR-M7)

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Remove references to non-existent `data/works.json`**

In the "Content Management" section, remove the line:
```
- **Works Data**: Also stored as JSON in `data/works.json` with metadata including layout, title, image, and credit information
```

In the "Data Flow" section, remove:
```
2. Alternative JSON-based approach in `data/works.json`
```
and renumber remaining items.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: remove stale references to non-existent data/works.json"
```

---

### Task 15: Final verification

- [ ] **Step 1: Full build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Update code review checklist**

In `docs/code-review-2026-03-29.md`, mark all items as `[x]`.

- [ ] **Step 3: Commit**

```bash
git add docs/code-review-2026-03-29.md
git commit -m "docs: mark all code review items as resolved"
```
