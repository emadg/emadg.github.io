export type LatticeCurrent = {
  route: number[];
  born: number;
  duration: number;
};

/** Short neighboring paths, advanced by the existing animation clock; no timers. */
export function createLatticeCurrents() {
  let paths: LatticeCurrent[] = [];
  let nextAt = 0;

  function reset(now = 0) {
    paths = [];
    nextAt = now + 1200 + Math.random() * 800;
  }

  function advance(now: number, columns: number, total: number) {
    paths = paths.filter((path) => now - path.born < path.duration);
    if (now < nextAt || !columns || total < 4) return paths;
    nextAt = now + 1500 + Math.random() * 500;
    const count = Math.min(Math.random() < 0.3 ? 2 : 1, 3 - paths.length);
    for (let path = 0; path < count; path++) {
      const route = [Math.floor(Math.random() * total)];
      const steps = Math.random() < 0.5 ? 2 : 3;
      for (let step = 0; step < steps; step++) {
        const index = route[route.length - 1];
        const candidates = [
          index % columns > 0 ? index - 1 : -1,
          index % columns < columns - 1 ? index + 1 : -1,
          index - columns,
          index + columns,
        ].filter(
          (neighbor) =>
            neighbor >= 0 && neighbor < total && !route.includes(neighbor),
        );
        if (!candidates.length) break;
        route.push(candidates[Math.floor(Math.random() * candidates.length)]);
      }
      if (route.length > 1)
        paths.push({ route, born: now, duration: 1300 + Math.random() * 300 });
    }
    return paths;
  }

  reset();
  return { reset, advance };
}
