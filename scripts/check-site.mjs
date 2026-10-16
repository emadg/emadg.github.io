#!/usr/bin/env node
// Exercise the production output, using the project's existing browser dependency.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { checkVisuals } from "./check-visuals.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const screenshots = process.env.SITE_QA_SCREENSHOTS;
const pages = [
  ["home", "/"],
  ["work", "/work/"],
  ["writing", "/blog/"],
  ["article", "/blog/building-ml-pipelines/"],
];
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  try {
    candidates.push(
      execFileSync("which", ["google-chrome"], { encoding: "utf8" }).trim(),
    );
  } catch {
    /* Use explicit candidates. */
  }
  const chrome = candidates.find((path) => path && existsSync(path));
  if (!chrome)
    throw new Error(
      "Install Chrome/Chromium or set CHROME_PATH to run browser checks.",
    );
  return chrome;
}

assert(
  existsSync(resolve(dist, "index.html")),
  "Run npm run build before checking the site.",
);
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = resolve(dist, `.${pathname}`);
    if (file !== resolve(dist) && !file.startsWith(resolve(dist) + sep))
      throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.writeHead(200, {
      "Content-Type": `${types[extname(file)] || "application/octet-stream"}; charset=utf-8`,
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
let assertions = 0;
function check(value, message) {
  assert(value, message);
  assertions++;
}

try {
  browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: [
      "--disable-dev-shm-usage",
      ...(process.env.CHROME_NO_SANDBOX === "1" ? ["--no-sandbox"] : []),
    ],
  });
  const page = await browser.newPage();
  const errors = [];
  const brokenRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      brokenRequests.push(response.url());
  });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  const links = new Set();
  if (screenshots) await mkdir(screenshots, { recursive: true });

  for (const width of [320, 390, 768, 1440]) {
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
      await page.goto(base, { waitUntil: "networkidle2" });
      await page.evaluate(() => localStorage.removeItem("theme"));
      for (const [name, route] of pages) {
        const response = await page.goto(base + route, {
          waitUntil: "networkidle2",
        });
        await page.evaluate(() => document.fonts.ready);
        check(response.status() === 200, `${route}: route loads`);
        const state = await page.evaluate(() => {
          const ids = [...document.querySelectorAll("[id]")].map(
            (element) => element.id,
          );
          const nav = [...document.querySelectorAll(".site-header nav > a")];
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            h1: document.querySelectorAll("h1").length,
            duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
            currentLinks: nav.filter(
              (link) => link.getAttribute("aria-current") === "page",
            ).length,
            navWrap: nav.some(
              (link) => link.getBoundingClientRect().height > 44,
            ),
            dark: document.documentElement.classList.contains("dark"),
            smooth: getComputedStyle(document.documentElement).scrollBehavior,
            links: [...document.querySelectorAll("a[href]")].map(
              (link) => link.href,
            ),
            visibleMotion: document
              .getAnimations()
              .some((animation) => animation.playState === "running"),
            cta: document.querySelector(".button")?.getBoundingClientRect()
              .bottom,
          };
        });
        check(
          !state.overflow,
          `${route}: no horizontal overflow at ${width}px/${theme}`,
        );
        check(
          state.h1 === 1 && state.duplicateIds.length === 0,
          `${route}: unique main heading and IDs`,
        );
        check(
          state.currentLinks === 1 && !state.navWrap,
          `${route}: navigation fits and marks current page at ${width}px`,
        );
        check(
          state.dark === (theme === "dark"),
          `${route}: follows ${theme} system preference`,
        );
        check(
          state.smooth === "auto" && !state.visibleMotion,
          `${route}: respects reduced motion`,
        );
        if (name === "home" || name === "work")
          check(
            state.cta < 844,
            `${route}: main action is in first mobile screen`,
          );
        state.links
          .filter((link) => link.startsWith(base))
          .forEach((link) => links.add(link));
        if (screenshots && (width === 390 || width === 1440)) {
          const label = `${name}-${width === 390 ? "mobile" : "desktop"}-${theme}`;
          await page.screenshot({
            path: resolve(screenshots, `${label}.png`),
            fullPage: true,
          });
          if (name === "home" || name === "work")
            await page.screenshot({
              path: resolve(screenshots, `${label}-top.png`),
            });
        }
      }
    }
  }

  for (const link of links) {
    const url = new URL(link);
    const response = await fetch(url);
    check(response.ok, `Internal link resolves: ${url.pathname}`);
    if (url.hash) {
      const html = await response.text();
      const found = await page.evaluate(
        (html, id) =>
          new DOMParser()
            .parseFromString(html, "text/html")
            .getElementById(id) !== null,
        html,
        decodeURIComponent(url.hash.slice(1)),
      );
      check(found, `Anchor resolves: ${url.pathname}${url.hash}`);
    }
  }
  for (const pdf of ["/resume.pdf", "/resume-ats.pdf"]) {
    const response = await fetch(base + pdf);
    check(
      response.headers.get("content-type").startsWith("application/pdf"),
      `${pdf}: correct MIME type`,
    );
    check(
      Buffer.from(await response.arrayBuffer())
        .subarray(0, 5)
        .toString() === "%PDF-",
      `${pdf}: serves a real PDF`,
    );
  }
  check(
    (await fetch(base + "/resume/")).ok,
    "Independent PDF source route still loads",
  );

  await page.goto(base + "/work/", { waitUntil: "networkidle2" });
  const resume = JSON.parse(
    await readFile(new URL("../src/data/resume.json", import.meta.url), "utf8"),
  );
  const workText = await page.$eval("main", (main) =>
    main.textContent.replace(/\s+/g, " "),
  );
  const contains = (text) =>
    workText.includes(text.replace(/\*\*/g, "").replace(/\s+/g, " "));
  check(
    resume.experience.every(
      (job) => contains(job.company) && contains(job.role),
    ),
    "Every employer and role remains accessible",
  );
  check(
    resume.experience
      .flatMap((job) => job.projects)
      .every(
        (project) => contains(project.name) && contains(project.description),
      ),
    "Every original project and its full description remains accessible",
  );
  check(
    resume.skills.flatMap((group) => group.items).every(contains),
    "The complete skill inventory remains accessible",
  );
  check(
    resume.education.every((entry) => contains(entry.institution)) &&
      resume.publications.every((entry) => contains(entry.title)),
    "Education and publications remain accessible",
  );
  await page.keyboard.press("Tab");
  check(
    await page.evaluate(() =>
      document.activeElement.classList.contains("skip-link"),
    ),
    "First tab reaches skip link",
  );
  await page.keyboard.press("Enter");
  check(
    await page.evaluate(() => document.activeElement.id === "main-content"),
    "Skip link focuses main content",
  );
  await page.focus(".technical-details > summary");
  await page.keyboard.press("Enter");
  check(
    await page.$eval(".technical-details", (details) => details.open),
    "Technical detail opens with keyboard",
  );
  if (screenshots) {
    await (
      await page.$(".work-story")
    ).screenshot({
      path: resolve(screenshots, "work-expanded-desktop-dark.png"),
    });
  }
  await page.keyboard.press("Enter");
  check(
    await page.$eval(".technical-details", (details) => !details.open),
    "Technical detail closes with keyboard",
  );
  await page.goto(base + "/work/#semantic-search", {
    waitUntil: "networkidle2",
  });
  await page.waitForFunction(
    () => document.getElementById("semantic-search")?.open,
  );
  check(true, "Direct project anchor reveals the relevant details");

  const wasDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.focus("#theme-toggle");
  await page.keyboard.press("Enter");
  check(
    await page.evaluate(
      (wasDark) =>
        document.documentElement.classList.contains("dark") !== wasDark,
      wasDark,
    ),
    "Theme toggles with keyboard",
  );
  const label = await page.$eval("#theme-toggle", (button) =>
    button.getAttribute("aria-label"),
  );
  check(
    label === (wasDark ? "Switch to dark theme" : "Switch to light theme"),
    "Theme control announces its next action",
  );
  await page.reload({ waitUntil: "networkidle2" });
  check(
    await page.evaluate(
      (wasDark) =>
        document.documentElement.classList.contains("dark") !== wasDark,
      wasDark,
    ),
    "Theme preference survives reload",
  );
  for (const dark of [false, true]) {
    await page.evaluate(
      (dark) => document.documentElement.classList.toggle("dark", dark),
      dark,
    );
    await page.hover(".button-primary");
    const contrast = await page.$eval(".button-primary", (button) => {
      const style = getComputedStyle(button);
      function luminance(color) {
        const rgb = color
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      }
      const values = [
        luminance(style.color),
        luminance(style.backgroundColor),
      ].sort((a, b) => a - b);
      return (values[1] + 0.05) / (values[0] + 0.05);
    });
    check(
      contrast >= 4.5,
      `Button hover contrast is sufficient in ${dark ? "dark" : "light"} theme`,
    );
  }
  await page.setViewport({ width: 320, height: 844, deviceScaleFactor: 1 });
  await page.$$eval("details", (entries) => {
    for (const entry of entries) entry.open = true;
  });
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Expanded project/skill details fit a narrow phone",
  );
  if (screenshots) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await (
      await page.$(".work-story")
    ).screenshot({
      path: resolve(screenshots, "work-expanded-mobile-dark.png"),
    });
  }

  const noScript = await browser.newPage();
  await noScript.setJavaScriptEnabled(false);
  for (const [, route] of pages) {
    await noScript.goto(base + route, { waitUntil: "networkidle2" });
    check(
      await noScript.$eval(
        "h1",
        (heading) => heading.getBoundingClientRect().height > 0,
      ),
      `${route}: content visible without JavaScript`,
    );
    check(
      await noScript.$eval('a[href^="mailto:"]', (link) =>
        link.getAttribute("href").includes("@"),
      ),
      `${route}: email works without JavaScript`,
    );
    check(
      await noScript.$eval(
        "#theme-toggle",
        (button) => getComputedStyle(button).display === "none",
      ),
      `${route}: unavailable theme control is hidden without JavaScript`,
    );
    check(
      await noScript.$eval(
        ".ambient-scene",
        (scene) => getComputedStyle(scene).backgroundImage !== "none",
      ),
      `${route}: static grid remains without JavaScript`,
    );
  }
  await noScript.goto(base + "/work/", { waitUntil: "networkidle2" });
  await noScript.click(".technical-details > summary");
  check(
    await noScript.$eval(".technical-details", (details) => details.open),
    "Native technical disclosure works without JavaScript",
  );
  await noScript.close();

  const blockedStorage = await browser.newPage();
  blockedStorage.on("pageerror", (error) => errors.push(error.message));
  await blockedStorage.evaluateOnNewDocument(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage is blocked", "SecurityError");
      },
    }),
  );
  await blockedStorage.goto(base, { waitUntil: "networkidle2" });
  await blockedStorage.click("#theme-toggle");
  check(
    await blockedStorage.$eval(
      "h1",
      (heading) => heading.getBoundingClientRect().height > 0,
    ),
    "Page and theme control work with blocked storage",
  );
  await blockedStorage.close();

  await checkVisuals({ page, browser, base, check, screenshots, errors });

  check(errors.length === 0, `No browser errors: ${errors.join("; ")}`);
  check(
    brokenRequests.length === 0,
    `No failed local resources: ${brokenRequests.join("; ")}`,
  );
  console.log(
    `Passed ${assertions} production browser checks across four widths, both themes, and JavaScript/storage fallbacks.`,
  );
  if (screenshots) console.log(`Screenshots: ${resolve(screenshots)}`);
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
