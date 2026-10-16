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
  let frame = 0;
  function update() {
    frame = 0;
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
    }
  });
}
