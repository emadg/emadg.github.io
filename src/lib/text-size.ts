/** Text reflows through rem units; browser zoom and native font preferences still work. */
export function initTextSize(button: HTMLButtonElement) {
  const root = document.documentElement;
  function update(large: boolean) {
    root.dataset.textSize = large ? "large" : "normal";
    button.setAttribute("aria-pressed", String(large));
    button.title = large ? "Use normal text" : "Use larger text";
  }
  update(root.dataset.textSize === "large");
  button.hidden = false;
  button.addEventListener("click", () => {
    const large = root.dataset.textSize !== "large";
    update(large);
    try {
      localStorage.setItem("text-size", large ? "large" : "normal");
    } catch {
      /* Keep the in-page choice when storage is unavailable. */
    }
  });
  const restore = () => {
    try {
      update(localStorage.getItem("text-size") === "large");
    } catch {
      /* Preserve the in-page choice if storage is blocked. */
    }
  };
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) restore();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "text-size" || event.key === null) restore();
  });

  // Font preferences can change header height; sticky sections and anchors follow it.
  const header = button.closest<HTMLElement>(".site-header");
  if (!header) return;
  let height = 0;
  const observer = new ResizeObserver(() => {
    const next = Math.ceil(header.getBoundingClientRect().height);
    if (next !== height) {
      height = next;
      root.style.setProperty("--header-height", `${height}px`);
    }
  });
  observer.observe(header);
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) observer.disconnect();
  });
}
