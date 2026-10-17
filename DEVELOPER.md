# Developer guide

## Structure

The site uses Astro static generation and Tailwind CSS v4. It does not need React, a client-side router, or a component framework. All routes render complete HTML at build time.

```text
src/data/resume.json       shared public facts + full resume content
src/data/portfolio.ts      website editorial content + stable project references
src/lib/resume.ts          PDF helpers, stage labels, safe inline bold rendering
src/layouts/Layout.astro  metadata, theme initialization, navigation, footer
src/components/Hero.astro introduction and decorative native SVG
src/components/ArrowIcon.astro    shared decorative navigation/download icons
src/components/WorkStories.astro  selected project stories + native details
src/components/Resume.astro       career, expertise, education, publications
src/components/Contact.astro      shared contact section
src/pages/work.astro      My Work route and direct-project disclosure handling
src/content/blog/         Markdown writing
src/styles/global.css     website only: tokens, typography, responsive layouts
```

Home is a landing page. My Work is the detailed web portfolio and resume download destination. `/resume` is reserved for PDF generation; its markup/styles and public PDF assets are independent of the website shell.

## Sources and attribution

Use `resume.json` for identity, contact addresses, dates, titles, stages, full descriptions, and skill inventories. `portfolio.ts` provides editorial structure without modifying the resume. Its project-name-to-ID mapping gives links stable targets and throws during the build when a source reference becomes invalid.

Featured project copy must preserve personal contribution and team/product context. Internal research workflows and proofs of concept must retain those stages. Keep estimated outcomes qualified. Do not import the master evidence inventory or application notes into public components.

Shared identity and links come from `identity` and `contactLinks` in `portfolio.ts`. Website-specific headlines and descriptive copy can vary by page. Change the general professional headline in `resume.json` to update the hero role. The source resume remains independent of `RESUME_DATA`, which selects tailored input only for the PDF route.

To add or rename a resume project:

1. Update `resume.json` and its employer association.
2. Add/update its stable ID in `portfolio.ts`; preserve existing IDs when renaming.
3. Update featured stories or expertise references when applicable.
4. Run `npm run check:site` to verify all routes and anchors.

The career view keeps every project accessible. Selected projects link to their stories; remaining projects have native disclosures. Grouped expertise shows representative tools first and preserves the remaining inventory in disclosures.

PomoCLI's public repository README was checked when it was featured. Additional personal projects need public source evidence and accurate descriptions. Keep private applications and finance projects out of public content unless explicitly authorized.

## Appearance and interactions

Semantic color tokens live in `global.css`, mapped to Tailwind via `@theme`. Light and dark palettes share the same semantic roles. Button hover text retains its theme-specific contrast. The Home illustration is a decorative SVG representing general areas of work, not a proprietary system diagram. It is omitted on small phones to keep the main content close to the introduction.

Use `ArrowIcon` for action hints rather than Unicode arrow glyphs. The forward arrow indicates a destination within the current page; the open-square up-right arrow indicates another page, website, or email application. Back navigation and downloads use matching directional variants. Icons inherit the link color, use rem-based dimensions that follow Aa, and remain decorative to assistive technology. The icon does not change a link's existing target or download behavior.

The Home terminal and article code blocks share opaque `--code-*` surface, text, border, and muted-text tokens. Light mode uses a pale blue-gray panel slightly darker than the page; dark mode uses navy. Markdown highlighting is generated with Shiki's `github-light-high-contrast` and `github-dark-default` palettes in `astro.config.mjs`. `defaultColor: false` leaves token colors in CSS variables, switched by the site's `.dark` class without another client script. When changing the panel tint or syntax theme, check comments and every syntax color against the actual panel background, as a palette designed for white can lose contrast on a tinted surface. Inline code continues to use the theme's accent tokens.

Core content interactions remain small client scripts:

- `Nav.astro`: show the progressive theme button, toggle the `.dark` class, persist explicit preference when storage is available, and follow system changes when no preference is saved.
- `work.astro`: open a native project disclosure when its ID is the direct URL fragment.

The inline theme initializer runs in the head to avoid a flash of the wrong theme. Storage failures are handled. With JavaScript disabled, the default light palette remains readable, the unavailable theme control is hidden, and content, navigation, downloads, email, and disclosures continue working.

The adjacent **Aa / Larger text** button uses a stable accessible name and `aria-pressed` state. It switches the root font between 100% and 125%, preserving browser font preferences and zoom. Website font sizes use `rem`; fluid heading clamps also scale their viewport term with `--text-scale`. Fixed layout dimensions remain independent. `text-size.ts` saves `text-size=normal|large` with guarded storage, follows changes in another tab, and restores the current preference on cached-page `pageshow`. The head initializer applies the saved size before content paints. Without JavaScript the unavailable control stays hidden; blocked storage still permits an in-page choice. The PDF route and files are independent.

On narrow phones the brand/display controls sit above the page links. A header ResizeObserver keeps `--header-height` accurate after text or viewport changes so sticky section links and native anchors stay below the header. It does not drive header sizing, avoiding a resize loop. Use relative units for future typography; avoid introducing fixed pixel text that bypasses the preference.

Avoid automatic flips, forced scrolling, hidden-until-animated content, and interactive styling on static labels. Use semantic headings, real links/buttons, native `details`/`summary`, visible keyboard focus, and readable text stage labels. The skip link focuses `main`. Reduced-motion CSS disables transitions and smooth scrolling. Background motion is an optional progressive enhancement with live reduced-motion, touch, visibility, and data-saving gates; a persistent pause control is available when motion can run.

The visual experiments add `Atmosphere.astro` and `ReadingProgress.astro`, backed by separate TypeScript modules and `styles/atmosphere.css`. The atmosphere uses deterministic square anchors, at most 1,000 points, a 5-megapixel backing-store budget, capped DPR, and at most about 30 actual canvas paints per second. Cursor links visit right/down neighbors; occasional currents can follow any immediate grid neighbor. A real mouse pointer event can establish fine input when a hybrid browser reports no pointer capability. Touch input never opts into motion. Hidden, paused, reduced-motion, and save-data states stop the painting loop. Canvas or JavaScript failure leaves a CSS dot-grid fallback.

The selected lattice gives each point an independent, continuous elliptical hover around its anchor: about 5px horizontal / 4px vertical reach with 7–9 second cycles. Faint CSS reference dots use the same pitch and origin, set only on resize. They sit above the frosted pane and below content, without a second canvas allocation. The cursor response spans 260px, enlarges nearby dots, and slightly reduces their orbit; the additional outward nudge is limited to 1.2px, and total displacement is capped at 6px. The response holds briefly after mouse/scroll activity and eases away over several seconds of inactivity. Idle hovering continues.

`lattice-currents.ts` schedules one or occasionally two short traveling paths every 1.5–2 seconds using the existing animation clock. Each path visits 2–3 immediate grid edges, with at most three concurrent paths. Their glow and short gradient trail move across partial segments rather than flashing whole links. Static modes clear all currents, and the hidden-tab clock pauses without accumulating missed bursts. There are no independent timers.

The reading plane restores the original design's 5px backdrop blur and low tint opacity (40% light / 24% dark). The header and key cards use stronger 14–16px blur with translucent fills. Opaque CSS fallbacks remain available when backdrop filtering is unsupported. Reference dots provide a quiet positional cue even when the moving layer is diffused by glass.

The motion button has the stable accessible name **Background motion**, an explicit pressed/on state, and a next-action tooltip. Motion off clears the clock, currents, offsets, pointer position/strength, highlights, and links, and redraws a regular static grid. It never freezes an interaction frame. Motion on eases the anchored hover back in. Its off preference uses guarded optional storage. A narrow desktop reserves footer space so the floating control cannot cover contact links.

Reading feedback uses native section anchors and `aria-current="location"`; page navigation continues to use `aria-current="page"`. A throttled scroll handler updates the decorative progress rule and current story marker. A body ResizeObserver includes disclosure and footer-size changes. Feedback does not alter URL fragments, focus, or content visibility. Desktop section navigation is sticky as a main-level sibling, below the sticky header; phones retain the compact ordinary section links.

My Work uses a three-column main grid: the middle column preserves the original reading width, while `.section-nav-shell` spans the same outer width as `.glass-backplane`. The undocked bar is transparent, sharing the pane's existing frost and uninterrupted side edges. When docked, an inset pseudo-element uses the pane's reading-glass tint and blur to soften scrolling content without covering those edges; the links remain aligned with the reading column. Above 999px, the existing reading handler eases the bar's height and type down over the first 160px after docking. With normal text it changes from about 71px/12px to 54px/11.5px; rem-based type continues following the Aa preference. Compensating transparent space keeps the document height and following content stable, and passes pointer input through to that content. The trigger comes from the non-sticky intro, avoiding feedback from the shrinking bar. Reduced motion and no JavaScript retain the full-size bar; narrower layouts keep ordinary, wrapping section links. There is no additional animation loop or dependency.

`src/data/visual.ts` selects the branch's art direction. The `experiment/glass-lattice` branch contains the user-selected direction and subsequent refinements. `experiment/glass-field` retains the initial alternative snapshot. See [the comparison and plan](docs/visual-experiments.md) for review instructions and screenshots.

Writing uses the same shell and a narrower reading column. Existing article text is preserved. Long code samples and tables scroll within their containers.

## Verification

`npm run check:site` builds production output and runs `scripts/check-site.mjs` using the existing Puppeteer dependency. No browser download is bundled. Chrome discovery honors `CHROME_PATH` and common system installations. The test server binds an ephemeral loopback port and serves only files from `dist/`.

Coverage includes four visible routes, four widths, two themes, internal destinations/fragments, actual PDF responses, unique headings/IDs, first-screen actions, keyboard skip/disclosure/theme controls, persisted theme, hover contrast, reduced motion, no-JavaScript content, and blocked storage. `scripts/check-text-size.mjs` adds all-route text scaling and reflow checks at 320, 390, 768, 1440, and 2560px in both themes, plus keyboard/persistence/cached-page/tab synchronization, blocked storage, no JavaScript, and a 200% root-font reflow check. The visual experiments also run `scripts/check-visuals.mjs`, which checks actual canvas pixels/paint calls, hovering with a stationary cursor, bounded displacement, exact reset to the same clean grid before/after reload, off-state persistence, live preferences, visibility/data-saving gates, touch/static behavior, allocation limits, missing canvas, and reading feedback. Optional `SITE_QA_SCREENSHOTS` retains screenshots in a chosen directory. Full QA artifacts should remain outside the repository; selected compressed review previews live in `docs/visual-previews/`.

A successful automated run complements visual inspection; inspect Home/My Work desktop and mobile screenshots in both themes and an open project disclosure. No browser suite establishes all assistive-technology behavior.

`scripts/check-section-nav.mjs` checks full-pane alignment, reading-column alignment, gradual height/type compaction, unchanged content/scroll geometry, restoration on upward scroll, target sizes, native keyboard anchors, and reduced-motion/no-JavaScript fallbacks across 320–1440px with both text sizes. Optional screenshots include the expanded and compact bar in both themes.

The existing full TypeScript command (`node node_modules/typescript/bin/tsc --noEmit`) can report the pre-existing Astro/Tailwind Vite plugin type mismatch in `astro.config.mjs` when the installed dependency tree includes different Vite versions. This is separate from the website data and production build. Record the actual result rather than masking it with a cast or changing dependency versions during a design change.

## PDF generation

`src/pages/resume.astro` imports its own raw layout CSS and uses `loadResume()` for public or tailored input. It does not import website components or `global.css`. Keep it independent.

Use `npm run pdf`, `--ats`, `--ats --compact`, and `--data`/`--out` as documented in README. For detailed layout contracts and validation, see [docs/resume-layouts.md](docs/resume-layouts.md).

## Hosting

The existing GitHub Pages workflow deploys `dist/` on a push to `main`. Cloudflare Pages uses the same static build. This redesign adds `/work` without replacing existing blog routes, `/resume`, or PDF URLs. No new hosting service, runtime backend, account, or storage is required.
