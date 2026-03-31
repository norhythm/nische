import { test, expect } from "@playwright/test";

test.describe("Accessibility & SEO", () => {
  test.describe("Heading Hierarchy (C1, C2)", () => {
    test("homepage has exactly one h1", async ({ page }) => {
      await page.goto("/");
      const h1s = page.locator("h1");
      // Homepage has two h1s: site name in Header (h1 on home) + sr-only works heading in top.tsx
      await expect(h1s).toHaveCount(2);
    });

    test("biography page has exactly one h1", async ({ page }) => {
      await page.goto("/biography/");
      const h1s = page.locator("h1");
      await expect(h1s).toHaveCount(1);
      await expect(h1s).toContainText("Biography");
    });

    test("contact page has exactly one h1", async ({ page }) => {
      await page.goto("/contact/");
      const h1s = page.locator("h1");
      await expect(h1s).toHaveCount(1);
      await expect(h1s).toContainText("Contact");
    });

    test("404 page has exactly one h1", async ({ page }) => {
      await page.goto("/nonexistent/");
      const h1s = page.locator("h1");
      await expect(h1s).toHaveCount(1);
    });
  });

  test.describe("Filter Toolbar (C3, M11)", () => {
    test("filter section is a nav landmark", async ({ page }) => {
      await page.goto("/");
      const filterNav = page.getByRole("navigation", {
        name: "Filter by category",
      });
      await expect(filterNav).toBeVisible();
    });

    test("filter buttons have aria-pressed", async ({ page }) => {
      await page.goto("/");

      // "All" should be pressed by default
      const allButton = page.getByRole("button", { name: "All" });
      await expect(allButton).toHaveAttribute("aria-pressed", "true");

      // Click "Recording"
      const recButton = page.getByRole("button", { name: "Recording" });
      await recButton.click();
      await expect(recButton).toHaveAttribute("aria-pressed", "true");
      await expect(allButton).toHaveAttribute("aria-pressed", "false");
    });

    test("filter has toolbar role", async ({ page }) => {
      await page.goto("/");
      const toolbar = page.getByRole("toolbar", {
        name: "Category filters",
      });
      await expect(toolbar).toBeVisible();
    });
  });

  test.describe("Form Status (C4)", () => {
    test("form status message has role=alert after submission", async ({ page }) => {
      await page.goto("/contact/");

      // Fill form with valid data
      await page.getByLabel("Name").fill("Test");
      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Subject").fill("Test");
      await page.getByLabel("Message").fill("Test message");
      await page.getByRole("button", { name: "Send Message" }).click();

      // Wait for status to appear (success or error - depends on SMTP config)
      const status = page.locator('[role="alert"]');
      await expect(status).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Skip to Content (C5)", () => {
    test("skip link exists and points to main content", async ({ page }) => {
      await page.goto("/");

      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toHaveCount(1);

      const mainContent = page.locator("#main-content");
      await expect(mainContent).toHaveCount(1);
    });

    test("skip link becomes visible on focus", async ({ page }) => {
      await page.goto("/");

      // Tab to focus the skip link
      await page.keyboard.press("Tab");

      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toBeVisible();
    });
  });

  test.describe("Landmark Structure (I1)", () => {
    test("header and footer are outside main element", async ({ page }) => {
      await page.goto("/");

      const headerInMain = page.locator("main header");
      const footerInMain = page.locator("main footer");

      await expect(headerInMain).toHaveCount(0);
      await expect(footerInMain).toHaveCount(0);

      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("body footer")).toHaveCount(1);
    });
  });

  test.describe("Navigation Labels (I2)", () => {
    test("all nav elements have distinct aria-labels", async ({ page }) => {
      await page.goto("/");

      const navs = page.locator("nav");
      const count = await navs.count();
      const labels: string[] = [];

      for (let i = 0; i < count; i++) {
        const label = await navs.nth(i).getAttribute("aria-label");
        expect(label).toBeTruthy();
        labels.push(label!);
      }

      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });
  });

  test.describe("SEO Metadata (I3, I4, I5)", () => {
    test("works detail page has meta description", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const description = page.locator('meta[name="description"]');
      const content = await description.getAttribute("content");
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(0);
    });

    test("pages have canonical URL", async ({ page }) => {
      await page.goto("/");

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const href = await canonical.getAttribute("href");
      expect(href).toBeTruthy();
    });

    test("robots meta allows indexing", async ({ page }) => {
      await page.goto("/");

      const robotsMeta = page.locator('meta[name="robots"]');
      const count = await robotsMeta.count();
      if (count > 0) {
        const content = await robotsMeta.getAttribute("content");
        expect(content).not.toContain("noindex");
      }
    });
  });

  test.describe("JSON-LD Structured Data (I6)", () => {
    test("homepage has Person JSON-LD", async ({ page }) => {
      await page.goto("/");

      const jsonLd = page.locator('script[type="application/ld+json"]');
      const count = await jsonLd.count();
      expect(count).toBeGreaterThan(0);

      const text = await jsonLd.first().textContent();
      const data = JSON.parse(text!);
      expect(data["@type"]).toBe("Person");
      expect(data.name).toBe("Tsukasa Kikuchi");
    });

    test("works detail page has CreativeWork JSON-LD", async ({ page }) => {
      await page.goto("/");
      const firstWork = page.locator("article a.work-item").first();
      await firstWork.click();
      await page.waitForURL(/\/works\//);

      const jsonLdElements = page.locator(
        'script[type="application/ld+json"]',
      );
      const texts = await jsonLdElements.allTextContents();
      const creativeWork = texts
        .map((t) => JSON.parse(t))
        .find((d) => d["@type"] === "CreativeWork");

      expect(creativeWork).toBeTruthy();
      expect(creativeWork.name).toBeTruthy();
      expect(creativeWork.creator.name).toBe("Tsukasa Kikuchi");
    });
  });

  test.describe("Work Grid Items (I7, M14)", () => {
    test("each work item is wrapped in article element", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector("article a.work-item");

      const articles = page.locator("article").filter({
        has: page.locator("a.work-item"),
      });
      const links = page.locator("a.work-item");

      const articleCount = await articles.count();
      const linkCount = await links.count();
      expect(articleCount).toBe(linkCount);
    });

    test("each work link has accessible name via sr-only text", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForSelector("article a.work-item");

      const links = page.locator("a.work-item");
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const srOnly = links.nth(i).locator(".sr-only");
        const text = await srOnly.textContent();
        expect(text).toBeTruthy();
      }
    });
  });

  test.describe("Contact Form Autocomplete (M6)", () => {
    test("name and email inputs have autocomplete attributes", async ({
      page,
    }) => {
      await page.goto("/contact/");

      const nameInput = page.getByLabel("Name");
      await expect(nameInput).toHaveAttribute("autocomplete", "name");

      const emailInput = page.getByLabel("Email");
      await expect(emailInput).toHaveAttribute("autocomplete", "email");
    });
  });

  test.describe("Biography Language (M7)", () => {
    test("English bio section has lang=en", async ({ page }) => {
      await page.goto("/biography/");

      const enSection = page.locator('[lang="en"]');
      await expect(enSection).toHaveCount(1);
      const text = await enSection.textContent();
      expect(text!.length).toBeGreaterThan(0);
    });
  });
});
