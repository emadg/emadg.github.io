# Interactive glass visual experiments

Base: `feat/home-and-work-portfolio` at `1f34888`. The approved content, storytelling, routes, and PDF sources stay intact. The completed base is backed up on GitHub before experimentation.

## Direction and comparison

GPT Astra recommended two restrained directions sharing the same content, geometry, and motion engine:

|           | Anchored lattice (primary)                                              | Soft field (alternative)                                |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| Branch    | `experiment/glass-lattice`                                              | `experiment/glass-field`                                |
| Grid      | Square anchors with very small independent movement                     | Same anchors, softer wave-like movement                 |
| Cursor    | Nearby points brighten; short horizontal/vertical neighbor links appear | A diffuse local halo and brighter points, without links |
| Glass     | Cool, clear frost with a readable central surface                       | Softer frost and a broader quiet color wash             |
| Character | Precise and technical                                                   | Soft and atmospheric                                    |

**Recommendation: Anchored lattice.** The matched browser renders and final GPT Astra visual/code review favor its precise character, clear frost, and local grid response. It develops the existing system illustration and directly expresses the requested square-grid idea. Soft field is complete as an alternative for a warmer, more atmospheric treatment. Both preserve the new content and its reading hierarchy.

## Phase 1 — Preserve and plan

- [x] Inspect the current branch and confirm a clean starting point.
- [x] Push the completed Home/My Work branch to GitHub.
- [x] Obtain an independent Astra plan before implementation.
- [x] Create a separate visual-experiment branch and record decisions here.

## Phase 2 — Shared atmosphere and reading feedback

- [x] Add a deterministic, bounded square lattice canvas with gentle anchored drift and a CSS static fallback.
- [x] Restore frosted surfaces with explicit background/surface/content layers; preserve opaque fallbacks, contrast, and layout geometry.
- [x] Add fine-pointer proximity response and local neighbor links, without cursor replacement, text motion, or scroll interception.
- [x] Provide a discoverable pause/resume control, guarded preference storage, and live reduced-motion/fine-pointer/save-data/visibility handling. Static states must stop repainting.
- [x] Add a restrained document-progress rule and active-section feedback on My Work, using `aria-current="location"`. Keep main navigation's `aria-current="page"`, keyboard focus, and passive URL fragments intact.
- [x] Keep phone effects static and simplify blur there; retain contact, download, and disclosure behavior.

Implementation budget: roughly 48–60px grid spacing, at most 1,000 anchored points, maximum 2px ambient displacement, 30 actual paints/sec, DPR capped at 1.5, and only right/down neighbor links near the pointer. No external animation dependencies.

## Phase 3 — Two visual experiments

- [x] Finish and capture the anchored-lattice direction in both themes, including pointer interaction and a story reading position.
- [x] Branch the alternative from the shared implementation and change only the visual configuration/treatment.
- [x] Capture matching viewport, theme, pointer, and scroll positions for the alternative; compare readability and character.
- [x] Get Astra's visual/code review, resolve findings, and recommend one direction.

## Phase 4 — Verify and back up

- [x] Run the existing production browser matrix for routes/content/downloads/accessibility/fallbacks.
- [x] Add non-reduced-motion checks for actual canvas changes, pause persistence, live preference changes, hidden-tab suspension, coarse-pointer behavior, missing canvas context, blocked storage, and bounded rendering.
- [x] Verify reading feedback at section boundaries and page bottom, disclosure-height changes, and passive scroll preserving URL/focus.
- [x] Check desktop/phone renders, no horizontal overflow or clipped controls, and static no-JavaScript fallbacks.
- [x] Record measured behavior and visual-review results; commit and push both experiment branches without merging into `main`.

## Verification results

Both production builds and **318 browser checks per direction** passed, including the original route/content/PDF matrix and the new motion, storage, canvas-fallback, allocation, and reading-feedback checks. Targeted source TypeScript and whitespace checks passed. The pre-existing full-repository Vite plugin type mismatch remains documented in the developer guide; no dependency versions were changed.

| Check                             | Anchored lattice                     | Soft field                                    |
| --------------------------------- | ------------------------------------ | --------------------------------------------- |
| Production build                  | Pass                                 | Pass                                          |
| Production browser suite          | 318 passed                           | 318 passed                                    |
| Source TypeScript                 | Pass                                 | Pass                                          |
| Paint-frequency sample, 1440×1000 | 30.0/sec; 630 points                 | 30.0/sec; 513 points                          |
| Astra visual/code review          | Recommended; no outstanding findings | Approved alternative; no outstanding findings |

The browser matrix covers 320, 390, 768, and 1440px widths in both themes. Focused checks also cover a 1024px footer/control layout, touch input, and a 4K/DPR-3 allocation scenario. Visibility and data-saving tests exercise their event-driven gates using browser-property fixtures; they are not physical-device battery benchmarks. Content, resume source/rendering, public PDFs, and dependency manifests have no changes relative to the base branch.

## Review record

Both directions have completed functional and visual review. GPT Astra recommended a small desktop lattice reading-plane refinement to make the cursor response less obscured: 70% fill and 4px blur. The stronger header/illustration frost and quieter phone treatment remain unchanged. Long reading sections retain their editorial layout. The final review found no remaining must-fix concerns and recommended keeping these restrained values.

Idle points are batched into one canvas fill, with individual styles only for nearby points. Paint frequency is capped near 30 per second; focused checks observed 30.0 paints/sec with 630 points at 1440×1000. This measures canvas paint frequency, not GPU cost or overall device frame rate. At large DPR/viewport sizes the renderer stays below 1,000 points and a roughly 5-megapixel backing store.

Astra's accessibility refinement uses the stable name **Background motion** and an explicit on/off pressed state. Narrow desktops reserve footer space for the floating control, and smaller viewports show a compact icon. Reduced motion, coarse input, data saving, and hidden-document state stop animation. A genuine mouse event can establish fine input on hybrid browsers that initially report no pointer capability. Continuous motion is optional; pause persists when storage is available.

Selected compressed viewport previews are retained below for remote review. Full QA artifacts and recordings stay outside source control. Screenshots capture an interaction state; use the local site or local recordings to assess motion. The preview images share a 1440×1000 viewport and the same cursor position near the exposed right edge of the glass plane.

### Matched previews

| Direction                          | Light                                                        | Dark                                                       |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| **Anchored lattice — recommended** | ![Lattice in light mode](visual-previews/lattice-light.webp) | ![Lattice in dark mode](visual-previews/lattice-dark.webp) |
| Soft field                         | ![Field in light mode](visual-previews/field-light.webp)     | ![Field in dark mode](visual-previews/field-dark.webp)     |

Motion recordings are **local only**, ignored by Git. Paths are relative to the repository root:

- `.local/visual-previews/lattice-motion.mp4`
- `.local/visual-previews/field-motion.mp4`

Only screenshots are included in the branches. Recordings have been removed from both experiment branches' history.

### Remote backups

- [Completed Home/My Work content redesign](https://github.com/emadg/emadg.github.io/tree/feat/home-and-work-portfolio)
- [Recommended anchored-lattice branch](https://github.com/emadg/emadg.github.io/tree/experiment/glass-lattice)
- [Alternative soft-field branch](https://github.com/emadg/emadg.github.io/tree/experiment/glass-field)

Both experiments derive from the completed content redesign. `src/data/visual.ts` selects the art direction. The field branch retains the initial alternative snapshot; the lattice branch contains the selected direction's subsequent refinements. These are review branches. Nothing has been merged into `main` or deployed to the production website.

### Trying a branch

```bash
git switch experiment/glass-lattice
npm run dev
# Or stop the server, switch to experiment/glass-field, and start it again.
```

Move the cursor across an exposed grid margin and across the glass reading area. On My Work, scroll through the sections and expand a project. Use the Background motion control to pause/resume. Phones and reduced-motion settings intentionally keep a static grid.
