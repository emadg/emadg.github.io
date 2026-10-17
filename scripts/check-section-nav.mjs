import { resolve } from "node:path";

export async function checkSectionNav({
  page,
  browser,
  base,
  check,
  screenshots,
}) {
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((done) =>
          requestAnimationFrame(() => requestAnimationFrame(done)),
        ),
    );
  const measure = () =>
    page.evaluate(() => {
      const shell = document.querySelector(".section-nav-shell");
      const nav = document.querySelector(".section-nav");
      const pane = document
        .querySelector(".glass-backplane")
        .getBoundingClientRect();
      const bounds = shell.getBoundingClientRect();
      const intro = document
        .querySelector(".work-intro")
        .getBoundingClientRect();
      const header = document
        .querySelector(".site-header")
        .getBoundingClientRect();
      const links = [...nav.querySelectorAll("a")];
      return {
        left: bounds.left,
        right: bounds.right,
        paneLeft: pane.left,
        paneRight: pane.right,
        contentLeft: intro.left,
        navLeft: nav.getBoundingClientRect().left,
        top: nav.getBoundingClientRect().top,
        headerBottom: header.bottom,
        height: nav.getBoundingClientRect().height,
        font: parseFloat(getComputedStyle(nav).fontSize),
        labelFont: parseFloat(
          getComputedStyle(nav.querySelector("span")).fontSize,
        ),
        shellHeight: bounds.height,
        documentHeight: document.documentElement.scrollHeight,
        contentTop:
          document.getElementById("selected-projects").getBoundingClientRect()
            .top + scrollY,
        overflow: document.documentElement.scrollWidth > innerWidth,
        targets: links.every(
          (link) => link.getBoundingClientRect().height >= 24,
        ),
        start:
          intro.bottom +
          scrollY +
          parseFloat(getComputedStyle(shell).marginTop) -
          header.height,
        position: getComputedStyle(shell).position,
        scroll: scrollY,
      };
    });
  const scroll = async (top) => {
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), top);
    await settle();
    return measure();
  };
  await page.bringToFront();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  for (const width of [320, 390, 768, 1000, 1280, 1367, 1440]) {
    for (const size of ["normal", "large"]) {
      const theme = size === "normal" ? "dark" : "light";
      await page.setViewport({
        width,
        height: width >= 1000 ? 600 : 844,
        deviceScaleFactor: 1,
      });
      await page.goto(base);
      await page.evaluate(
        ({ size, theme }) => {
          localStorage.setItem("text-size", size);
          localStorage.setItem("theme", theme);
          localStorage.setItem("background-motion", "paused");
        },
        { size, theme },
      );
      await page.goto(base + "/work/", { waitUntil: "networkidle2" });
      await page.evaluate(() => document.fonts.ready);
      await settle();
      const initial = await measure();
      const context = `${width}px, ${size} text`;
      check(
        Math.abs(initial.left - initial.paneLeft) < 0.6 &&
          Math.abs(initial.right - initial.paneRight) < 0.6,
        `Explore surface spans the glass pane at ${context}`,
      );
      check(
        Math.abs(initial.contentLeft - initial.navLeft) < 0.6 &&
          !initial.overflow &&
          initial.targets,
        `Explore links align with content, reflow, and retain usable targets at ${context}`,
      );
      if (width < 1000) {
        const later = await scroll(initial.start + 200);
        check(
          later.position !== "sticky" &&
            Math.abs(later.height - initial.height) < 0.6 &&
            later.font === initial.font,
          `Narrow Explore navigation keeps a stable ordinary layout at ${context}`,
        );
        continue;
      }
      const midpoint = await scroll(initial.start + 80);
      const compact = await scroll(initial.start + 200);
      check(
        initial.height > midpoint.height &&
          midpoint.height > compact.height &&
          initial.font > midpoint.font &&
          midpoint.font > compact.font,
        `Explore height and type gradually shrink after docking at ${context}`,
      );
      check(
        initial.height - compact.height > 8 &&
          initial.height - compact.height < 20 &&
          compact.font >= initial.font * 0.95 &&
          compact.labelFont < initial.labelFont &&
          compact.targets,
        `Compact Explore remains readable with a modest height reduction at ${context}`,
      );
      check(
        Math.abs(compact.top - compact.headerBottom) < 0.6 &&
          Math.abs(compact.shellHeight - initial.shellHeight) < 0.6 &&
          Math.abs(compact.documentHeight - initial.documentHeight) < 1 &&
          Math.abs(compact.contentTop - initial.contentTop) < 0.6 &&
          Math.abs(compact.scroll - (initial.start + 200)) < 1,
        `Docking and compaction preserve content flow and requested scroll at ${context}`,
      );
      if (screenshots && width === 1367) {
        await page.screenshot({
          path: resolve(screenshots, `explore-compact-${theme}-${size}.png`),
        });
        await scroll(initial.start);
        await page.screenshot({
          path: resolve(screenshots, `explore-expanded-${theme}-${size}.png`),
        });
      }
      const restored = await scroll(initial.start - 30);
      check(
        Math.abs(restored.height - initial.height) < 0.6 &&
          restored.font === initial.font,
        `Explore restores its original size when scrolling back at ${context}`,
      );
    }
  }
  await page.setViewport({ width: 1367, height: 600, deviceScaleFactor: 1 });
  await page.evaluate(() => localStorage.setItem("text-size", "normal"));
  await page.goto(base + "/work/", { waitUntil: "networkidle2" });
  const expanded = await measure();
  await scroll(expanded.start + 200);
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await settle();
  const reduced = await measure();
  check(
    Math.abs(reduced.height - expanded.height) < 0.6 &&
      reduced.font === expanded.font,
    "Live reduced-motion preference retains a stable full-size Explore bar",
  );
  await page.focus('.section-nav a[href="#experience"]');
  await page.keyboard.press("Enter");
  await settle();
  check(
    await page.evaluate(() => {
      const target = document
        .getElementById("experience")
        .getBoundingClientRect();
      const bar = document
        .querySelector(".section-nav")
        .getBoundingClientRect();
      return location.hash === "#experience" && target.top >= bar.bottom;
    }),
    "Keyboard section links use native fragments and reveal their heading below both sticky bars",
  );

  const noScript = await browser.newPage();
  try {
    await noScript.setJavaScriptEnabled(false);
    await noScript.setViewport({ width: 1367, height: 600 });
    await noScript.goto(base + "/work/", { waitUntil: "networkidle2" });
    check(
      await noScript.evaluate(() => {
        const pane = document
          .querySelector(".glass-backplane")
          .getBoundingClientRect();
        const shell = document
          .querySelector(".section-nav-shell")
          .getBoundingClientRect();
        return (
          Math.abs(pane.left - shell.left) < 0.6 &&
          Math.abs(pane.right - shell.right) < 0.6 &&
          getComputedStyle(document.querySelector(".section-nav-shell"))
            .position === "sticky"
        );
      }),
      "Without JavaScript, Explore retains a full-width sticky surface and native links",
    );
  } finally {
    await noScript.close();
  }
  await page.evaluate(() => localStorage.removeItem("text-size"));
  console.log(
    "Explore bar: full-pane surface, gradual height/type compaction, stable flow, keyboard, and fallbacks passed.",
  );
}
