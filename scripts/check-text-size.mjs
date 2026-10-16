// Exercise text reflow and preference behavior against the production site.
export async function checkTextSize({ page, browser, base, check, errors }) {
  await page.bringToFront();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(base);
  await page.evaluate(() => localStorage.setItem("text-size", "normal"));
  const fonts = () =>
    page.evaluate(() =>
      Object.fromEntries(
        [
          "body",
          "h1",
          ".hero-intro",
          ".hero-note",
          ".metadata",
          ".small-label",
          ".details-content",
          ".skill-list",
          ".prose",
          ".prose h2",
          ".prose pre",
          ".site-header nav > a",
          "footer",
          "footer a",
          ".button",
          "summary",
        ].flatMap((selector) => {
          const element = document.querySelector(selector);
          return element
            ? [[selector, parseFloat(getComputedStyle(element).fontSize)]]
            : [];
        }),
      ),
    );
  const fits = () =>
    page.evaluate(() => {
      const controls = [
        ...document.querySelectorAll(
          ".site-header a, .display-controls button",
        ),
      ].map((element) => element.getBoundingClientRect());
      return (
        document.documentElement.scrollWidth <= innerWidth &&
        controls.every(
          (bounds, index) =>
            bounds.left >= -0.5 &&
            bounds.right <= innerWidth + 0.5 &&
            controls.every(
              (other, otherIndex) =>
                index === otherIndex ||
                bounds.right <= other.left + 0.5 ||
                bounds.left >= other.right - 0.5 ||
                bounds.bottom <= other.top + 0.5 ||
                bounds.top >= other.bottom - 0.5,
            ),
        )
      );
    });
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );

  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewport({
      width,
      height: width > 760 ? 1000 : 844,
      deviceScaleFactor: 1,
    });
    for (const theme of ["light", "dark"]) {
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
        { name: "prefers-color-scheme", value: theme },
      ]);
      await page.evaluate(
        (theme) => localStorage.setItem("theme", theme),
        theme,
      );
      for (const route of [
        "/",
        "/work/",
        "/blog/",
        "/blog/building-ml-pipelines/",
      ]) {
        await page.goto(base + route, { waitUntil: "networkidle2" });
        await page.evaluate(() => document.fonts.ready);
        const normal = await fonts();
        await page.click("#text-size-toggle");
        await settle();
        const large = await fonts();
        check(
          Object.keys(normal).every(
            (selector) =>
              Math.abs(large[selector] / normal[selector] - 1.25) < 0.005,
          ),
          `${route}: every sampled text style grows 25% at ${width}px/${theme}`,
        );
        if (route === "/work/")
          await page.$$eval("details", (details) =>
            details.forEach((element) => (element.open = true)),
          );
        check(
          await fits(),
          `${route}: larger text and header controls reflow without overlap or overflow at ${width}px/${theme}`,
        );
        await page.click("#text-size-toggle");
      }
    }
  }
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(base + "/work/", { waitUntil: "networkidle2" });
  await page.focus("#text-size-toggle");
  await page.keyboard.press("Space");
  check(
    await page.$eval(
      "#text-size-toggle",
      (button) =>
        button.getAttribute("aria-label") === "Larger text" &&
        button.getAttribute("aria-pressed") === "true" &&
        document.activeElement === button,
    ),
    "Larger-text toggle works with keyboard, keeps focus, and announces its pressed state",
  );
  await page.goto(base + "/blog/", { waitUntil: "networkidle2" });
  await page.reload({ waitUntil: "networkidle2" });
  check(
    await page.evaluate(
      () =>
        document.documentElement.dataset.textSize === "large" &&
        document
          .getElementById("text-size-toggle")
          .getAttribute("aria-pressed") === "true",
    ),
    "Text-size choice survives navigation and reload",
  );
  await page.focus("#text-size-toggle");
  await page.keyboard.press("Enter");
  check(
    await page.evaluate(
      () =>
        document.documentElement.dataset.textSize === "normal" &&
        localStorage.getItem("text-size") === "normal" &&
        document
          .getElementById("text-size-toggle")
          .getAttribute("aria-pressed") === "false",
    ),
    "Keyboard toggle restores and persists normal text",
  );

  for (const width of [320, 1440]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await page.goto(base + "/work/", { waitUntil: "networkidle2" });
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await settle();
    check(
      await fits(),
      `Text also reflows at a 200% root font size at ${width}px`,
    );
  }

  const blocked = await browser.newPage();
  blocked.on("pageerror", (error) => errors.push(error.message));
  await blocked.evaluateOnNewDocument(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await blocked.goto(base, { waitUntil: "networkidle2" });
  await blocked.click("#text-size-toggle");
  check(
    await blocked.evaluate(
      () => document.documentElement.dataset.textSize === "large",
    ),
    "Text-size toggle still works when storage is blocked",
  );
  await blocked.close();

  const noScript = await browser.newPage();
  await noScript.setJavaScriptEnabled(false);
  await noScript.goto(base, { waitUntil: "networkidle2" });
  check(
    await noScript.$eval(
      "#text-size-toggle",
      (button) => getComputedStyle(button).display === "none",
    ),
    "No-JavaScript pages hide the unavailable text-size control",
  );
  await noScript.close();
  await page.goto(base);
  const otherTab = await browser.newPage();
  await otherTab.goto(base, { waitUntil: "networkidle2" });
  await otherTab.evaluate(() => localStorage.setItem("text-size", "large"));
  await page.waitForFunction(
    () => document.documentElement.dataset.textSize === "large",
  );
  check(true, "Text-size preference updates an already-open tab");
  await otherTab.close();
  await page.evaluate(() => {
    localStorage.setItem("text-size", "normal");
    dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
  });
  check(
    await page.evaluate(
      () => document.documentElement.dataset.textSize === "normal",
    ),
    "Restored pages refresh their saved text preference",
  );
  await page.evaluate(() => localStorage.removeItem("text-size"));
  console.log(
    "Text-size preference: typography, reflow, keyboard, storage, and fallback checks passed.",
  );
}
