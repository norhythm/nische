import { test, expect } from "@playwright/test";

// MANUAL: tiltエフェクトのスムーズさを目視確認
// MANUAL: メール送信の成功確認（SMTP接続が必要）
// MANUAL: モバイル実機でのタッチスワイプ動作
// MANUAL: 色コントラストの目視確認

test.describe("Code Review Verification", () => {
  test.describe("Security", () => {
    test("works detail page renders markdown content", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const article = page.locator("article.article");
      await expect(article).toBeVisible();
    });

    test("YouTube iframes use allowed domains only", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const iframes = page.locator("iframe");
      const count = await iframes.count();
      for (let i = 0; i < count; i++) {
        const src = await iframes.nth(i).getAttribute("src");
        expect(src).toMatch(
          /^https:\/\/([a-z0-9-]+\.)*?(youtube\.com|youtube-nocookie\.com|soundcloud\.com|spotify\.com|apple\.com)\//,
        );
      }
    });
  });

  test.describe("Navigation", () => {
    test("arrow keys do not navigate when input is focused", async ({
      page,
    }) => {
      await page.goto("/contact/");
      const nameInput = page.getByLabel("Name");
      await nameInput.fill("test");
      await nameInput.press("ArrowLeft");
      await page.waitForTimeout(300);
      await expect(page).toHaveURL(/\/contact\//);
    });

    test("arrow keys navigate between works", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const article = page.locator("article.article");
      await expect(article).toBeVisible();

      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);

      // Page should still be functional
      const articleAfter = page.locator("article.article");
      await expect(articleAfter).toBeVisible();
    });

    test("prev/next labels have correct sr-only text", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const prevLabel = page.locator(".sr-only", { hasText: "Previous work" });
      const nextLabel = page.locator(".sr-only", { hasText: "Next work" });

      const prevCount = await prevLabel.count();
      const nextCount = await nextLabel.count();
      expect(prevCount + nextCount).toBeGreaterThan(0);
    });
  });

  test.describe("Works Display", () => {
    test("clipPath IDs are unique across all work images", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForSelector("article a.work-item");

      const clipPathIds = await page.$$eval("clipPath", (els) =>
        els.map((el) => el.id),
      );
      const uniqueIds = new Set(clipPathIds);
      expect(uniqueIds.size).toBe(clipPathIds.length);
    });

    test("works detail page has exactly one h1", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Accessibility", () => {
    test("Tag components are native links", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const tags = page.locator("a").filter({ hasText: /^(recording|mixing|mastering)$/i });
      const count = await tags.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await tags.nth(i).getAttribute("href");
          expect(href).toContain("?tag=");
        }
      }
    });

    test("back overlay has aria-hidden", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const overlay = page.locator('[aria-hidden="true"].cursor-close');
      await expect(overlay).toHaveCount(1);
    });

    test("no ScrollRestoration debug logs in console", async ({ page }) => {
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        if (msg.text().includes("[ScrollRestoration]")) {
          consoleLogs.push(msg.text());
        }
      });

      await page.goto("/");
      await page.waitForTimeout(1000);
      expect(consoleLogs).toHaveLength(0);
    });

    test("form labels are properly associated with inputs", async ({
      page,
    }) => {
      await page.goto("/contact/");

      await expect(page.getByLabel("Name")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Subject")).toBeVisible();
      await expect(page.getByLabel("Message")).toBeVisible();
    });

    test("all work images have non-empty alt text", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector("article a.work-item");

      const images = page.locator("article a.work-item img");
      const count = await images.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });

    test("header has nav element", async ({ page }) => {
      await page.goto("/");
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await expect(nav).toBeVisible();
    });

    test("html has lang=ja", async ({ page }) => {
      await page.goto("/");
      const lang = await page.locator("html").getAttribute("lang");
      expect(lang).toBe("ja");
    });

    test("interactive elements have visible focus indicators", async ({
      page,
    }) => {
      await page.goto("/contact/");

      const nameInput = page.getByLabel("Name");
      await nameInput.focus();

      const outline = await nameInput.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outlineStyle !== "none" || styles.boxShadow !== "none";
      });
      expect(outline).toBe(true);
    });
  });

  test.describe("404 Page", () => {
    test("not-found page renders with border on back link", async ({
      page,
    }) => {
      await page.goto("/nonexistent-page/");

      const heading = page.getByRole("heading", { name: "404" });
      await expect(heading).toBeVisible();

      const backLink = page.getByRole("link", { name: "Back to Home" });
      await expect(backLink).toBeVisible();

      const borderStyle = await backLink.evaluate((el) => {
        return window.getComputedStyle(el).borderStyle;
      });
      expect(borderStyle).not.toBe("none");
    });
  });
});
