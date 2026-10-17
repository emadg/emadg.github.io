/** Reading feedback never changes focus, the URL, or the visibility of content. */
export function initReadingProgress() {
  const progress = document.querySelector<HTMLElement>(
    ".reading-progress > span",
  );
  const main = document.querySelector("main");
  if (!progress || !main) return;
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>(
      '.section-nav a[href^="#"]',
    ),
  ];
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((section): section is HTMLElement => !!section);
  const stories = [...document.querySelectorAll<HTMLElement>(".work-story")];
  const shell = document.querySelector<HTMLElement>(".section-nav-shell");
  const intro = document.querySelector<HTMLElement>(".work-intro");
  const header = document.querySelector<HTMLElement>(".site-header");
  const desktop = matchMedia("(min-width: 1000px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let lastCompact = "";
  let frame = 0;
  function update() {
    frame = 0;
    if (shell && intro && header) {
      let compact = 0;
      let docked = false;
      if (desktop.matches) {
        // The intro stays in normal flow, so shrinking a pinned bar cannot move its trigger.
        const dockingPoint =
          intro.getBoundingClientRect().bottom +
          scrollY +
          parseFloat(getComputedStyle(shell).marginTop) -
          header.getBoundingClientRect().height;
        const distance = scrollY - dockingPoint;
        docked = distance >= -0.5;
        if (!reduced.matches) {
          const fraction = Math.min(1, Math.max(0, distance / 160));
          compact = fraction * fraction * (3 - 2 * fraction);
        }
      }
      const dockingState = String(docked);
      if (shell.dataset.docked !== dockingState) {
        shell.dataset.docked = dockingState;
      }
      const value = compact.toFixed(4);
      if (value !== lastCompact) {
        shell.style.setProperty("--section-nav-compact", value);
        lastCompact = value;
      }
    }
    const maximum = Math.max(
      0,
      document.documentElement.scrollHeight - innerHeight,
    );
    progress!.style.transform = `scaleX(${maximum ? Math.min(1, Math.max(0, scrollY / maximum)) : 0})`;
    const line = Math.max(180, innerHeight * 0.28);
    const bottom = scrollY >= maximum - 3;
    let current: HTMLElement | undefined;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
    }
    if (bottom && sections.length) current = sections.at(-1);
    for (const link of links) {
      if (link.hash === `#${current?.id}`) {
        if (link.getAttribute("aria-current") !== "location")
          link.setAttribute("aria-current", "location");
      } else if (link.hasAttribute("aria-current"))
        link.removeAttribute("aria-current");
    }
    for (const story of stories) {
      const bounds = story.getBoundingClientRect();
      const active = bounds.top <= line && bounds.bottom > line;
      if (active && !story.dataset.readingActive)
        story.dataset.readingActive = "true";
      else if (!active && story.dataset.readingActive)
        delete story.dataset.readingActive;
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  desktop.addEventListener("change", schedule);
  reduced.addEventListener("change", schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  update();
  window.addEventListener("pagehide", (event) => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!event.persisted) {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      desktop.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
    }
  });
}
