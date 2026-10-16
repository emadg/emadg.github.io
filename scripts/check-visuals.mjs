// Additional behavioral checks for the interactive visual experiments.
import { resolve } from "node:path";

export async function checkVisuals({
  page,
  browser,
  base,
  check,
  screenshots,
  errors,
}) {
  const delay = (ms) => new Promise((done) => setTimeout(done, ms));
  const instrument = await page.evaluateOnNewDocument(() => {
    const stats = {
      paints: 0,
      arcs: 0,
      strokes: 0,
      maxArcs: 0,
      maxStrokes: 0,
      cursorStrokes: 0,
      currentStrokes: 0,
      maxCurrentStrokes: 0,
      radius: 0,
      points: [],
    };
    window.__visualStats = stats;
    const prototype = CanvasRenderingContext2D.prototype;
    for (const method of ["clearRect", "arc", "stroke"]) {
      const original = prototype[method];
      prototype[method] = function (...args) {
        if (this.canvas.classList.contains("ambient-grid")) {
          if (method === "clearRect") {
            stats.paints++;
            stats.arcs = 0;
            stats.strokes = 0;
            stats.cursorStrokes = 0;
            stats.currentStrokes = 0;
            stats.radius = 0;
            stats.points = [];
          }
          if (method === "arc") {
            stats.arcs++;
            stats.maxArcs = Math.max(stats.maxArcs, stats.arcs);
            stats.points.push(args.slice(0, 3));
            stats.radius = Math.max(stats.radius, args[2]);
          }
          if (method === "stroke") {
            stats.strokes++;
            stats.maxStrokes = Math.max(stats.maxStrokes, stats.strokes);
            if (this.lineWidth > 1) {
              stats.currentStrokes++;
              stats.maxCurrentStrokes = Math.max(
                stats.maxCurrentStrokes,
                stats.currentStrokes,
              );
            } else stats.cursorStrokes++;
          }
        }
        return original.apply(this, args);
      };
    }
  });
  const paintCount = () => page.evaluate(() => window.__visualStats.paints);
  const pixels = () =>
    page.$eval(".ambient-grid", (canvas) => canvas.toDataURL());
  const state = () =>
    page.$eval(".ambient-scene", (scene) => scene.dataset.state);
  // Earlier fallback tests open tabs; make visibility-gate checks deterministic.
  await page.bringToFront();
  await page.setViewport({
    width: 1440,
    height: 1000,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
    { name: "prefers-color-scheme", value: "dark" },
  ]);
  await page.goto(base);
  await page.evaluate(() => {
    localStorage.removeItem("background-motion");
    localStorage.setItem("theme", "dark");
  });
  await page.reload({ waitUntil: "networkidle2" });
  await page.mouse.move(1370, 310);
  await page.waitForFunction(
    () => document.querySelector(".ambient-scene").dataset.state === "running",
  );
  check(
    await page.$eval(".motion-toggle", (button) => !button.hidden),
    "Desktop motion has a visible pause control",
  );
  check(
    await page.$eval(
      ".motion-toggle",
      (button) =>
        button.getAttribute("aria-label") === "Background motion" &&
        button.getAttribute("aria-pressed") === "true",
    ),
    "Motion toggle has a stable accessible name and an explicit on/off state",
  );
  await page.$eval(".motion-toggle", (button) => button.click());
  const restingGrid = await pixels();
  const anchors = await page.evaluate(() => window.__visualStats.points);
  const baseRadius = anchors[0][2];
  check(
    anchors[0][1] === anchors[1][1] &&
      anchors.every((point) => point[2] === anchors[0][2]) &&
      (await page.evaluate(() => window.__visualStats.strokes)) === 0,
    "Motion off renders aligned anchors with uniform dots and no links",
  );
  await page.$eval(".motion-toggle", (button) => button.click());
  await page.mouse.move(1370, 310);
  await delay(600);
  const idleBefore = await page.evaluate(() => window.__visualStats.points);
  const before = await pixels();
  await delay(500);
  check(
    before !== (await pixels()),
    "Points keep hovering with the cursor held still",
  );
  const hovering = await page.evaluate(() => window.__visualStats.points);
  const anchorDistance = ([x, y]) =>
    Math.min(...anchors.map(([ax, ay]) => Math.hypot(x - ax, y - ay)));
  check(
    Math.hypot(
      hovering[0][0] - idleBefore[0][0],
      hovering[0][1] - idleBefore[0][1],
    ) > 0.05 && hovering.every((point) => anchorDistance(point) <= 6.01),
    "Points away from the cursor hover independently and stay within 6px of their anchors",
  );
  await page.mouse.move(1370, 310);
  await delay(550);
  const variant = await page.$eval("body", (body) => body.dataset.visualStyle);
  const stats = await page.evaluate(() => window.__visualStats);
  check(stats.maxArcs <= 1000, "Canvas point count stays bounded");
  check(
    variant === "field"
      ? stats.maxStrokes === 0
      : stats.maxStrokes > 0 && stats.maxStrokes <= 2000,
    "Cursor treatment matches the selected direction with bounded neighbors",
  );
  const count = await paintCount();
  await delay(1100);
  const paintsPerSecond = ((await paintCount()) - count) / 1.1;
  check(paintsPerSecond <= 33, "Actual canvas paints are capped near 30fps");
  console.log(
    `Visuals (${variant}): ${paintsPerSecond.toFixed(1)} paints/sec; at most ${stats.maxArcs} points/frame in this viewport.`,
  );
  if (screenshots) {
    await page.screenshot({
      path: resolve(screenshots, "interaction-desktop-dark.png"),
    });
  }
  if (variant === "lattice") {
    check(
      await page.$eval(".lattice-anchors", (reference) => {
        const style = getComputedStyle(reference);
        return (
          style.pointerEvents === "none" &&
          reference.getAttribute("aria-hidden") === "true" &&
          parseFloat(style.getPropertyValue("--anchor-pitch")) > 0
        );
      }),
      "Fixed reference dots remain decorative and use the renderer's grid spacing",
    );
    await page.mouse.move(720, 650);
    await delay(500);
    const activeRadius = await page.evaluate(() => window.__visualStats.radius);
    check(
      activeRadius > baseRadius + 0.5,
      "Nearby cursor makes the lattice dots visibly larger",
    );
    // A stationary pointer fades; idle hovering and occasional currents continue.
    await delay(2500);
    const fadingRadius = await page.evaluate(() => window.__visualStats.radius);
    check(
      fadingRadius > baseRadius + 0.05 && fadingRadius < activeRadius - 0.2,
      "Cursor influence fades gradually rather than snapping off",
    );
    await page.waitForFunction(
      (baseRadius) =>
        window.__visualStats.radius < baseRadius + 0.05 &&
        window.__visualStats.cursorStrokes === 0,
      { timeout: 10000, polling: 100 },
      baseRadius,
    );
    check(
      true,
      "Idle cursor highlights and links fade away while background hovering continues",
    );
    check(
      await page.evaluate(
        () =>
          window.__visualStats.maxCurrentStrokes > 0 &&
          window.__visualStats.maxCurrentStrokes <= 18,
      ),
      "Occasional traveling currents render with a bounded number of segments",
    );
    await page.evaluate(() => scrollTo({ top: 200, behavior: "instant" }));
    await delay(450);
    check(
      await page.evaluate(
        (baseRadius) =>
          window.__visualStats.radius > baseRadius + 0.5 &&
          window.__visualStats.cursorStrokes > 0,
        baseRadius,
      ),
      "Scrolling revives the nearby cursor response without requiring pointer motion",
    );
    await page.mouse.move(730, 650);
    await delay(400);
    check(
      await page.evaluate(
        (baseRadius) => window.__visualStats.radius > baseRadius + 0.5,
        baseRadius,
      ),
      "Pointer movement revives the faded local response",
    );
  }
  await page.$eval(".motion-toggle", (button) => button.click());
  check(
    (await state()) === "paused",
    "Motion off returns to a static background",
  );
  check(
    restingGrid === (await pixels()) &&
      (await page.evaluate(() => window.__visualStats.strokes)) === 0,
    "Motion off clears displacement, cursor highlights, and links back to the same clean grid",
  );
  check(
    await page.$eval(
      ".motion-toggle",
      (button) =>
        button.getAttribute("aria-label") === "Background motion" &&
        button.getAttribute("aria-pressed") === "false",
    ),
    "Paused toggle keeps its accessible name and announces the off state",
  );
  const frozen = await pixels();
  const frozenCount = await paintCount();
  await page.mouse.move(150, 700);
  await delay(250);
  check(
    frozen === (await pixels()) && frozenCount === (await paintCount()),
    "Paused canvas stops painting and ignores pointer motion",
  );
  await page.reload({ waitUntil: "networkidle2" });
  await page.mouse.move(1370, 310);
  check(
    (await state()) === "paused",
    "Pause preference survives navigation/reload",
  );
  check(
    restingGrid === (await pixels()),
    "Reload restores the same neutral grid when motion is off",
  );
  await page.focus(".motion-toggle");
  await page.keyboard.press("Space");
  check(
    (await state()) === "running",
    "Background motion resumes with a keyboard control",
  );
  const resumedCount = await paintCount();
  await page.waitForFunction(
    (count) => window.__visualStats.paints > count,
    {},
    resumedCount,
  );
  check(true, "Keyboard resume restarts actual canvas paints");
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.waitForFunction(
    () => document.querySelector(".ambient-scene").dataset.state === "reduced",
  );
  const reducedCount = await paintCount();
  const reducedPixels = await pixels();
  await delay(250);
  check(
    reducedCount === (await paintCount()) && reducedPixels === (await pixels()),
    "Live reduced-motion preference stops actual canvas paints",
  );
  check(
    await page.$eval(".motion-toggle", (button) => button.hidden),
    "Reduced motion cannot be overridden by the visual control",
  );
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.waitForFunction(
    () => document.querySelector(".ambient-scene").dataset.state === "running",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenCount = await paintCount();
  await delay(220);
  check(
    (await state()) === "hidden" && hiddenCount === (await paintCount()),
    "Hidden documents stop the rendering loop",
  );
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  check(
    (await state()) === "running",
    "Rendering resumes after the document becomes visible",
  );
  if (await page.evaluate(() => !!navigator.connection)) {
    await page.evaluate(() => {
      Object.defineProperty(navigator.connection, "saveData", {
        configurable: true,
        get: () => true,
      });
      navigator.connection.dispatchEvent(new Event("change"));
    });
    const savedCount = await paintCount();
    await delay(220);
    check(
      (await state()) === "save-data" && savedCount === (await paintCount()),
      "Data-saving preference uses a static grid",
    );
    await page.evaluate(() => {
      delete navigator.connection.saveData;
      navigator.connection.dispatchEvent(new Event("change"));
    });
  }
  await page.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  await page.mouse.move(990, 320);
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await delay(80);
  check(
    await page.evaluate(() => {
      const control = document
        .querySelector(".motion-toggle")
        .getBoundingClientRect();
      return [...document.querySelectorAll("footer a")].every((link) => {
        const bounds = link.getBoundingClientRect();
        return (
          bounds.right <= control.left ||
          bounds.left >= control.right ||
          bounds.bottom <= control.top ||
          bounds.top >= control.bottom
        );
      });
    }),
    "Motion control does not obscure footer links on a narrow desktop",
  );
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  await page.reload({ waitUntil: "networkidle2" });
  const touchCount = await paintCount();
  await delay(220);
  check(
    (await state()) === "coarse" && touchCount === (await paintCount()),
    "Touch devices use static points without a background loop",
  );
  check(
    await page.$eval(".motion-toggle", (button) => button.hidden),
    "Touch layout avoids an unnecessary motion control",
  );
  await page.setViewport({
    width: 3840,
    height: 2160,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 3,
  });
  await page.reload({ waitUntil: "networkidle2" });
  const dimensions = await page.$eval(".ambient-grid", (canvas) => ({
    width: canvas.width,
    height: canvas.height,
  }));
  check(
    dimensions.width * dimensions.height <= 5_010_000 &&
      dimensions.width <= 3840 * 1.5,
    "Large high-DPR displays keep a bounded canvas allocation",
  );
  check(
    await page.evaluate(() => window.__visualStats.maxArcs <= 1000),
    "Large displays keep the same point-count budget",
  );

  await page.setViewport({
    width: 1440,
    height: 1000,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
    { name: "prefers-color-scheme", value: "dark" },
  ]);
  await page.goto(base + "/work/", { waitUntil: "networkidle2" });
  await page.focus("#theme-toggle");
  const hash = new URL(page.url()).hash;
  for (const id of [
    "selected-projects",
    "experience",
    "expertise",
    "education",
  ]) {
    await page.evaluate((id) => {
      const section = document.getElementById(id);
      scrollTo({
        top: section.getBoundingClientRect().top + scrollY - 220,
        behavior: "instant",
      });
    }, id);
    await page.waitForFunction(
      (id) =>
        document
          .querySelector('.section-nav [aria-current="location"]')
          ?.getAttribute("href") === `#${id}`,
      {},
      id,
    );
    check(true, `Reading feedback follows ${id}`);
  }
  check(
    new URL(page.url()).hash === hash &&
      (await page.evaluate(() => document.activeElement.id === "theme-toggle")),
    "Passive reading feedback preserves URL and keyboard focus",
  );
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await delay(60);
  check(
    await page.$eval(
      '.section-nav [aria-current="location"]',
      (link) => link.hash === "#education",
    ),
    "Reading feedback handles the bottom of the page",
  );
  await page.evaluate(() => {
    document.querySelector(".technical-details").open = true;
  });
  await delay(90);
  check(
    await page.$eval(".reading-progress > span", (element) => {
      const actual = new DOMMatrix(getComputedStyle(element).transform).a;
      const expected =
        scrollY / (document.documentElement.scrollHeight - innerHeight);
      return Math.abs(actual - expected) < 0.01;
    }),
    "Progress recalculates when a disclosure changes document height",
  );
  if (screenshots) {
    await page.evaluate(() => {
      scrollTo({
        top: document.getElementById("grounded-summarization").offsetTop - 160,
        behavior: "instant",
      });
    });
    await delay(60);
    await page.screenshot({
      path: resolve(screenshots, "reading-desktop-dark.png"),
    });
  }
  await page.removeScriptToEvaluateOnNewDocument(instrument.identifier);

  const unavailable = await browser.newPage();
  unavailable.on("pageerror", (error) => errors.push(error.message));
  await unavailable.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      return this.classList.contains("ambient-grid")
        ? null
        : original.apply(this, args);
    };
  });
  await unavailable.goto(base, { waitUntil: "networkidle2" });
  check(
    await unavailable.$eval(
      ".ambient-scene",
      (scene) =>
        scene.dataset.state === "unavailable" &&
        getComputedStyle(scene).backgroundImage !== "none",
    ),
    "Unavailable canvas retains the static CSS grid",
  );
  check(
    await unavailable.$eval(".motion-toggle", (button) => button.hidden),
    "Unavailable canvas does not expose a broken control",
  );
  await unavailable.close();

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
  await blocked.mouse.move(400, 300);
  check(
    await blocked.$eval(
      ".ambient-scene",
      (scene) => scene.dataset.state === "running",
    ),
    "Background motion works with storage blocked",
  );
  await blocked.click(".motion-toggle");
  check(
    await blocked.$eval(
      ".ambient-scene",
      (scene) => scene.dataset.state === "paused",
    ),
    "Pause works in-page when storage cannot persist preferences",
  );
  await blocked.close();
}
