# Interactive glass visual experiments

Base: `feat/home-and-work-portfolio` at `1f34888`. The approved content, storytelling, routes, and PDF sources stay intact. The completed base is backed up on GitHub before experimentation.

## Direction and comparison

GPT Astra recommended two restrained directions sharing the same content, geometry, and motion engine:

| | Anchored lattice (primary) | Diffraction field (alternative) |
| --- | --- | --- |
| Branch | `experiment/glass-lattice` | `experiment/glass-field` |
| Grid | Square anchors with very small independent movement | Same anchors, softer wave-like movement |
| Cursor | Nearby points brighten; short horizontal/vertical neighbor links appear | A diffuse local halo and brighter points, without links |
| Glass | Cool, clear frost with a readable central surface | Softer frost and a broader quiet color wash |
| Character | Precise and technical | Soft and atmospheric |

The lattice is the initial recommendation because it develops the existing system illustration and directly expresses the requested square-grid idea. Choose after comparable browser renders and Astra review.

## Phase 1 — Preserve and plan

- [x] Inspect the current branch and confirm a clean starting point.
- [x] Push the completed Home/My Work branch to GitHub.
- [x] Obtain an independent Astra plan before implementation.
- [x] Create a separate visual-experiment branch and record decisions here.

## Phase 2 — Shared atmosphere and reading feedback

- [ ] Add a deterministic, bounded square lattice canvas with gentle anchored drift and a CSS static fallback.
- [ ] Restore frosted surfaces with explicit background/surface/content layers; preserve opaque fallbacks, contrast, and layout geometry.
- [ ] Add fine-pointer proximity response and local neighbor links, without cursor replacement, text motion, or scroll interception.
- [ ] Provide a discoverable pause/resume control, guarded preference storage, and live reduced-motion/fine-pointer/save-data/visibility handling. Static states must stop repainting.
- [ ] Add a restrained document-progress rule and active-section feedback on My Work, using `aria-current="location"`. Keep main navigation's `aria-current="page"`, keyboard focus, and passive URL fragments intact.
- [ ] Keep phone effects static and simplify blur there; retain contact, download, and disclosure behavior.

Implementation budget: roughly 48–60px grid spacing, at most 1,000 anchored points, maximum 2px ambient displacement, 30 actual paints/sec, DPR capped at 1.5, and only right/down neighbor links near the pointer. No external animation dependencies.

## Phase 3 — Two visual experiments

- [ ] Finish and capture the anchored-lattice direction in both themes, including pointer interaction and a story reading position.
- [ ] Branch the alternative from the shared implementation and change only the visual configuration/treatment.
- [ ] Capture matching viewport, theme, pointer, and scroll positions for the alternative; compare readability and character.
- [ ] Get Astra's visual/code review, resolve findings, and recommend one direction.

## Phase 4 — Verify and back up

- [ ] Run the existing production browser matrix for routes/content/downloads/accessibility/fallbacks.
- [ ] Add non-reduced-motion checks for actual canvas changes, pause persistence, live preference changes, hidden-tab suspension, coarse-pointer behavior, missing canvas context, blocked storage, and bounded rendering.
- [ ] Verify reading feedback at section boundaries and page bottom, disclosure-height changes, and passive scroll preserving URL/focus.
- [ ] Check desktop/phone renders, no horizontal overflow or clipped controls, and static no-JavaScript fallbacks.
- [ ] Record measured behavior and visual-review results; commit and push both experiment branches without merging into `main`.

## Review record

Implementation and comparison results will be recorded here. Screenshots and other large QA artifacts stay outside source control. Continuous motion is always optional; reduced motion and coarse-pointer devices use a static presentation.
