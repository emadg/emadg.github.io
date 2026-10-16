# Developer guide

## Structure

The site uses Astro static generation and Tailwind CSS v4. It does not need React, a client-side router, or a component framework. All routes render complete HTML at build time.

```text
src/data/resume.json       shared public facts + full resume content
src/data/portfolio.ts      website editorial content + stable project references
src/lib/resume.ts          PDF helpers, stage labels, safe inline bold rendering
src/layouts/Layout.astro  metadata, theme initialization, navigation, footer
src/components/Hero.astro introduction and decorative native SVG
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

Core content interactions remain small client scripts:

- `Nav.astro`: show the progressive theme button, toggle the `.dark` class, persist explicit preference when storage is available, and follow system changes when no preference is saved.
- `work.astro`: open a native project disclosure when its ID is the direct URL fragment.

The inline theme initializer runs in the head to avoid a flash of the wrong theme. Storage failures are handled. With JavaScript disabled, the default light palette remains readable, the unavailable theme control is hidden, and content, navigation, downloads, email, and disclosures continue working.

Avoid automatic flips, forced scrolling, hidden-until-animated content, and interactive styling on static labels. Use semantic headings, real links/buttons, native `details`/`summary`, visible keyboard focus, and readable text stage labels. The skip link focuses `main`. Reduced-motion CSS disables transitions and smooth scrolling. Background motion is an optional progressive enhancement with live reduced-motion, touch, visibility, and data-saving gates; a persistent pause control is available when motion can run.

The visual experiments add `Atmosphere.astro` and `ReadingProgress.astro`, backed by separate TypeScript modules and `styles/atmosphere.css`. The atmosphere uses deterministic square anchors, at most 1,000 points, a 5-megapixel backing-store budget, capped DPR, and at most about 30 actual canvas paints per second. Only right/down neighbors can connect. A real mouse pointer event can establish fine input when a hybrid browser reports no pointer capability. Touch input never opts into motion. Hidden, paused, reduced-motion, and save-data states stop the painting loop. Canvas or JavaScript failure leaves a CSS dot-grid fallback.

The motion button has the stable accessible name **Background motion**, an explicit pressed/on state, and a next-action tooltip. Its pause preference uses guarded optional storage. A narrow desktop reserves footer space so the floating control cannot cover contact links.

Reading feedback uses native section anchors and `aria-current="location"`; page navigation continues to use `aria-current="page"`. A throttled scroll handler updates the decorative progress rule and current story marker. A body ResizeObserver includes disclosure and footer-size changes. Feedback does not alter URL fragments, focus, or content visibility. Desktop section navigation is sticky as a main-level sibling, below the sticky header; phones retain the compact ordinary section links.

`src/data/visual.ts` selects the branch's art direction. The `experiment/glass-field` branch retains the initial alternative snapshot; `experiment/glass-lattice` contains the selected direction's subsequent refinements. See [the comparison and plan](docs/visual-experiments.md) for review instructions and screenshots.

Writing uses the same shell and a narrower reading column. Existing article text is preserved. Long code samples and tables scroll within their containers.

## Verification

`npm run check:site` builds production output and runs `scripts/check-site.mjs` using the existing Puppeteer dependency. No browser download is bundled. Chrome discovery honors `CHROME_PATH` and common system installations. The test server binds an ephemeral loopback port and serves only files from `dist/`.

Coverage includes four visible routes, four widths, two themes, internal destinations/fragments, actual PDF responses, unique headings/IDs, first-screen actions, keyboard skip/disclosure/theme controls, persisted theme, hover contrast, reduced motion, no-JavaScript content, and blocked storage. The visual experiments also run `scripts/check-visuals.mjs`, which checks actual canvas pixels/paint calls, pause persistence, live preferences, visibility/data-saving gates, touch/static behavior, allocation limits, missing canvas, and reading feedback. Optional `SITE_QA_SCREENSHOTS` retains screenshots in a chosen directory. Generated QA artifacts should remain outside the repository.

A successful automated run complements visual inspection; inspect Home/My Work desktop and mobile screenshots in both themes and an open project disclosure. No browser suite establishes all assistive-technology behavior.

The existing full TypeScript command (`node node_modules/typescript/bin/tsc --noEmit`) can report the pre-existing Astro/Tailwind Vite plugin type mismatch in `astro.config.mjs` when the installed dependency tree includes different Vite versions. This is separate from the website data and production build. Record the actual result rather than masking it with a cast or changing dependency versions during a design change.

## PDF generation

`src/pages/resume.astro` imports its own raw layout CSS and uses `loadResume()` for public or tailored input. It does not import website components or `global.css`. Keep it independent.

Use `npm run pdf`, `--ats`, `--ats --compact`, and `--data`/`--out` as documented in README. For detailed layout contracts and validation, see [docs/resume-layouts.md](docs/resume-layouts.md).

## Hosting

The existing GitHub Pages workflow deploys `dist/` on a push to `main`. Cloudflare Pages uses the same static build. This redesign adds `/work` without replacing existing blog routes, `/resume`, or PDF URLs. No new hosting service, runtime backend, account, or storage is required.
