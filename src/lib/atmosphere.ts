import { visualStyle } from "../data/visual";

type Point = {
  x: number;
  y: number;
  phase: number;
  dx: number;
  dy: number;
  influence: number;
};
type Connection = EventTarget & { saveData?: boolean };

/** Decorative progressive enhancement; all content and navigation remain native HTML. */
export function initAtmosphere(scene: HTMLElement, toggle: HTMLButtonElement) {
  const canvas = scene.querySelector<HTMLCanvasElement>("canvas");
  if (!canvas) return;
  let context: CanvasRenderingContext2D | null;
  try {
    context = canvas.getContext("2d");
  } catch {
    context = null;
  }
  if (!context) {
    scene.dataset.state = "unavailable";
    return;
  }
  const ctx = context;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;
  const events = new AbortController();
  const options = { passive: true, signal: events.signal };
  let paused = false;
  try {
    paused = localStorage.getItem("background-motion") === "paused";
  } catch {
    /* Storage is optional. */
  }
  let width = 0,
    height = 0,
    columns = 0;
  let points: Point[] = [];
  let rgb = "35, 114, 142";
  let dark = false;
  let frame = 0,
    elapsed = 0,
    lastTick = 0,
    lastPaint = 0;
  let pointerX = -1000,
    pointerY = -1000,
    pointerStrength = 0,
    pointerInside = false;
  let disposed = false;
  // Observed mouse input also covers hybrid browsers reporting no fine pointer.
  let mouseSeen = false;
  const field = visualStyle === "field";
  const hasFinePointer = () => fine.matches || mouseSeen;
  const canAnimate = () =>
    !paused &&
    !reduced.matches &&
    hasFinePointer() &&
    !connection?.saveData &&
    !document.hidden;

  function paint() {
    ctx.clearRect(0, 0, width, height);
    const still = reduced.matches || !hasFinePointer() || connection?.saveData;
    const time = still ? 0 : elapsed / 1000;
    const strength = still ? 0 : pointerStrength;
    const radius = field ? 210 : 145;
    if (field && strength > 0.005) {
      const halo = ctx.createRadialGradient(
        pointerX,
        pointerY,
        0,
        pointerX,
        pointerY,
        260,
      );
      halo.addColorStop(0, `rgba(${rgb}, ${strength * (dark ? 0.105 : 0.07)})`);
      halo.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
    }
    const nearby: Point[] = [];
    const baseOpacity = (dark ? 0.27 : 0.23) * (field ? 0.7 : 1);
    // Batch idle points into one fill; only cursor-local points need individual styles.
    ctx.beginPath();
    for (const point of points) {
      const distance =
        strength > 0.005
          ? Math.hypot(point.x - pointerX, point.y - pointerY)
          : radius;
      point.influence = Math.max(0, 1 - distance / radius) ** 2 * strength;
      const drift = field ? 1.2 : 1.8;
      const phase = field ? point.x * 0.003 + point.y * 0.002 : point.phase;
      point.dx =
        point.x +
        (still ? 0 : Math.sin(time * (field ? 0.25 : 0.35) + phase) * drift);
      point.dy =
        point.y +
        (still
          ? 0
          : Math.cos(time * (field ? 0.21 : 0.29) + phase * 1.3) * drift);
      if (point.influence > 0.005) nearby.push(point);
      else {
        ctx.moveTo(point.dx + 0.9, point.dy);
        ctx.arc(point.dx, point.dy, 0.9, 0, Math.PI * 2);
      }
    }
    ctx.fillStyle = `rgba(${rgb}, ${baseOpacity})`;
    ctx.fill();
    for (const point of nearby) {
      ctx.beginPath();
      ctx.arc(point.dx, point.dy, 0.9 + point.influence * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${baseOpacity + point.influence * 0.4})`;
      ctx.fill();
    }
    // Only immediate grid neighbors can connect: bounded O(n), never all pairs.
    if (!field && strength > 0.005) {
      for (let index = 0; index < points.length; index++) {
        const point = points[index];
        if (point.influence < 0.015) continue;
        for (const neighborIndex of [
          index % columns < columns - 1 ? index + 1 : -1,
          index + columns,
        ]) {
          const neighbor = points[neighborIndex];
          if (!neighbor || neighbor.influence < 0.015) continue;
          ctx.beginPath();
          ctx.moveTo(point.dx, point.dy);
          ctx.lineTo(neighbor.dx, neighbor.dy);
          ctx.strokeStyle = `rgba(${rgb}, ${Math.min(point.influence, neighbor.influence) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function tick(now: number) {
    frame = 0;
    if (disposed || !canAnimate()) return;
    elapsed += Math.min(now - lastTick, 80);
    lastTick = now;
    if (now - lastPaint >= 1000 / 30 - 0.5) {
      pointerStrength += ((pointerInside ? 1 : 0) - pointerStrength) * 0.12;
      if (pointerStrength < 0.001) pointerStrength = 0;
      paint();
      lastPaint = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function refresh() {
    if (disposed) return;
    cancelAnimationFrame(frame);
    frame = 0;
    const staticPreference =
      reduced.matches || !hasFinePointer() || !!connection?.saveData;
    if (staticPreference) {
      pointerStrength = 0;
      pointerInside = false;
    }
    scene.dataset.state = document.hidden
      ? "hidden"
      : reduced.matches
        ? "reduced"
        : !hasFinePointer()
          ? "coarse"
          : connection?.saveData
            ? "save-data"
            : paused
              ? "paused"
              : "running";
    document.documentElement.dataset.backgroundMotion = staticPreference
      ? "static"
      : paused
        ? "paused"
        : "active";
    toggle.hidden = staticPreference;
    toggle.setAttribute("aria-pressed", String(!paused));
    toggle.title = paused
      ? "Resume background motion"
      : "Pause background motion";
    const label = toggle.querySelector("span");
    if (label) label.textContent = paused ? "Motion off" : "Motion on";
    if (!document.hidden) paint();
    if (canAnimate()) {
      lastTick = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(
      window.devicePixelRatio || 1,
      1.5,
      Math.sqrt(5_000_000 / (width * height)),
    );
    ctx.canvas.width = Math.round(width * ratio);
    ctx.canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    let pitch = Math.max(
      width < 760 ? 58 : field ? 56 : 50,
      Math.sqrt((width * height) / 800),
    );
    while (
      (Math.ceil(width / pitch) + 1) * (Math.ceil(height / pitch) + 1) >
      1000
    )
      pitch *= 1.1;
    columns = Math.ceil(width / pitch) + 1;
    const rows = Math.ceil(height / pitch) + 1;
    points = Array.from({ length: columns * rows }, (_, index) => ({
      x: (index % columns) * pitch + pitch * 0.35,
      y: Math.floor(index / columns) * pitch + pitch * 0.35,
      phase: Math.sin(index * 127.1 + 311.7) * Math.PI,
      dx: 0,
      dy: 0,
      influence: 0,
    }));
    refresh();
  }

  function theme() {
    dark = document.documentElement.classList.contains("dark");
    rgb =
      getComputedStyle(scene).getPropertyValue("--field-rgb").trim() ||
      "35, 114, 142";
    refresh();
  }

  toggle.addEventListener(
    "click",
    () => {
      paused = !paused;
      try {
        localStorage.setItem("background-motion", paused ? "paused" : "on");
      } catch {
        /* Keep the in-page preference. */
      }
      refresh();
    },
    { signal: events.signal },
  );
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "mouse" && event.isTrusted && !mouseSeen) {
        mouseSeen = true;
        refresh();
      }
      if (!canAnimate() || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerInside = true;
    },
    options,
  );
  document.documentElement.addEventListener(
    "pointerleave",
    () => {
      pointerInside = false;
    },
    options,
  );
  window.addEventListener(
    "blur",
    () => {
      pointerInside = false;
    },
    options,
  );
  window.addEventListener("resize", resize, options);
  document.addEventListener("visibilitychange", refresh, {
    signal: events.signal,
  });
  reduced.addEventListener("change", refresh, { signal: events.signal });
  fine.addEventListener(
    "change",
    () => {
      mouseSeen = false;
      refresh();
    },
    { signal: events.signal },
  );
  connection?.addEventListener("change", refresh, { signal: events.signal });
  const themeObserver = new MutationObserver(theme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener(
    "pagehide",
    (event) => {
      cancelAnimationFrame(frame);
      if (!event.persisted) {
        disposed = true;
        events.abort();
        themeObserver.disconnect();
      }
    },
    { signal: events.signal },
  );
  window.addEventListener("pageshow", refresh, { signal: events.signal });
  resize();
  theme();
  scene.classList.add("canvas-ready");
}
