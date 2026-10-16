import { visualStyle } from "../data/visual";
import { createLatticeCurrents, type LatticeCurrent } from "./lattice-currents";

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
export function initAtmosphere(
  scene: HTMLElement,
  toggle: HTMLButtonElement,
  reference?: HTMLElement,
) {
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
    lastPaint = 0,
    motionStrength = 0;
  let pointerX = -1000,
    pointerY = -1000,
    pointerTargetX = -1000,
    pointerTargetY = -1000,
    pointerStrength = 0,
    pointerInside = false,
    lastActivity = -Infinity;
  let disposed = false;
  // Observed mouse input also covers hybrid browsers reporting no fine pointer.
  let mouseSeen = false;
  const field = visualStyle === "field";
  const currents = createLatticeCurrents();
  const hasFinePointer = () => fine.matches || mouseSeen;
  const canAnimate = () =>
    !paused &&
    !reduced.matches &&
    hasFinePointer() &&
    !connection?.saveData &&
    !document.hidden;

  function paint() {
    ctx.clearRect(0, 0, width, height);
    const still =
      paused || reduced.matches || !hasFinePointer() || connection?.saveData;
    const time = still ? 0 : elapsed / 1000;
    const strength = still ? 0 : pointerStrength;
    const radius = field ? 210 : 260;
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
    const baseOpacity = field ? (dark ? 0.27 : 0.23) * 0.7 : dark ? 0.5 : 0.46;
    const dotRadius = field ? 0.9 : 1.8;
    // Batch idle points into one fill; only cursor-local points need individual styles.
    ctx.beginPath();
    for (const point of points) {
      const distance =
        strength > 0.005
          ? Math.hypot(point.x - pointerX, point.y - pointerY)
          : radius;
      point.influence = Math.max(0, 1 - distance / radius) ** 1.5 * strength;
      // Near the cursor, larger dots settle into a slightly smaller orbit.
      const drift = field ? 1.2 : 5 * (1 - point.influence * 0.18);
      const phase = field ? point.x * 0.003 + point.y * 0.002 : point.phase;
      // Each point hovers around its own anchor, even without a nearby cursor.
      const orbit = time * (0.72 + (Math.sin(phase) + 1) * 0.08) + phase;
      let offsetX = Math.sin(field ? time * 0.25 + phase : orbit) * drift;
      let offsetY =
        Math.cos(field ? time * 0.21 + phase * 1.3 : orbit) *
        drift *
        (field ? 1 : 0.8);
      if (!field && point.influence > 0.005) {
        const normalX = (point.x - pointerX) / Math.max(distance, 1);
        const normalY = (point.y - pointerY) / Math.max(distance, 1);
        const sway = Math.sin(time * 0.9 + phase) * 0.4;
        // A small outward nudge and sideways sway; points never leave their cell.
        offsetX += (normalX * 1.2 - normalY * sway) * point.influence;
        offsetY += (normalY * 1.2 + normalX * sway) * point.influence;
      }
      const scale = still
        ? 0
        : motionStrength *
          Math.min(1, 6 / Math.max(1, Math.hypot(offsetX, offsetY)));
      point.dx = point.x + offsetX * scale;
      point.dy = point.y + offsetY * scale;
      if (point.influence > 0.005) nearby.push(point);
      else {
        ctx.moveTo(point.dx + dotRadius, point.dy);
        ctx.arc(point.dx, point.dy, dotRadius, 0, Math.PI * 2);
      }
    }
    ctx.fillStyle = `rgba(${rgb}, ${baseOpacity})`;
    ctx.fill();
    for (const point of nearby) {
      ctx.beginPath();
      ctx.arc(
        point.dx,
        point.dy,
        dotRadius + point.influence * 1.4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(${rgb}, ${baseOpacity + point.influence * 0.35})`;
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
          ctx.strokeStyle = `rgba(${rgb}, ${Math.min(point.influence, neighbor.influence) * 0.48})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!field && !still) {
      for (const current of currents.advance(elapsed, columns, points.length))
        paintCurrent(current);
    }
  }

  function paintCurrent(current: LatticeCurrent) {
    const trail = 1.25;
    const head =
      ((elapsed - current.born) / current.duration) *
      (current.route.length - 1 + trail);
    ctx.lineCap = "round";
    for (let segment = 0; segment < current.route.length - 1; segment++) {
      const start = Math.max(segment, head - trail);
      const end = Math.min(segment + 1, head);
      if (start >= end) continue;
      const from = points[current.route[segment]],
        to = points[current.route[segment + 1]];
      const startX = from.dx + (to.dx - from.dx) * (start - segment);
      const startY = from.dy + (to.dy - from.dy) * (start - segment);
      const endX = from.dx + (to.dx - from.dx) * (end - segment);
      const endY = from.dy + (to.dy - from.dy) * (end - segment);
      const fadeIn = Math.min(1, (elapsed - current.born) / 180);
      const opacity = fadeIn * motionStrength;
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(
        0,
        `rgba(${rgb}, ${Math.max(0, 1 - (head - start) / trail) * opacity * 0.6})`,
      );
      gradient.addColorStop(
        1,
        `rgba(${rgb}, ${Math.max(0, 1 - (head - end) / trail) * opacity * 0.6})`,
      );
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(${rgb}, ${opacity * 0.09})`;
      ctx.lineWidth = 4.5;
      ctx.stroke();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.35;
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  }

  function tick(now: number) {
    frame = 0;
    if (disposed || !canAnimate()) return;
    elapsed += Math.min(now - lastTick, 80);
    lastTick = now;
    if (now - lastPaint >= 1000 / 30 - 0.5) {
      const delta = Math.min(now - lastPaint, 100);
      const ease = 1 - Math.exp(-delta / 160);
      motionStrength += (1 - motionStrength) * ease;
      const active = pointerInside && elapsed - lastActivity < 900;
      const activityEase = 1 - Math.exp(-delta / (active ? 180 : 1800));
      pointerStrength += ((active ? 1 : 0) - pointerStrength) * activityEase;
      pointerX += (pointerTargetX - pointerX) * ease;
      pointerY += (pointerTargetY - pointerY) * ease;
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
    if (staticPreference || paused) {
      elapsed = 0;
      motionStrength = 0;
      pointerStrength = 0;
      pointerInside = false;
      pointerX = pointerTargetX = -1000;
      pointerY = pointerTargetY = -1000;
      lastActivity = -Infinity;
      currents.reset();
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
      lastTick = lastPaint = performance.now();
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
    // CSS reference dots do not repaint every frame or allocate a second canvas.
    reference?.style.setProperty("--anchor-pitch", `${pitch}px`);
    reference?.style.setProperty("--anchor-origin", `${pitch * 0.35}px`);
    currents.reset(elapsed);
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
      if (!pointerInside && pointerStrength < 0.001) {
        pointerX = event.clientX;
        pointerY = event.clientY;
      }
      pointerTargetX = event.clientX;
      pointerTargetY = event.clientY;
      pointerInside = true;
      lastActivity = elapsed;
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
  window.addEventListener(
    "scroll",
    () => {
      if (canAnimate() && pointerInside) lastActivity = elapsed;
    },
    options,
  );
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
