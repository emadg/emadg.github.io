# Home and My Work implementation

Branch: `feat/home-and-work-portfolio`

## Goal and decisions

Keep Home a concise, human introduction with selected evidence and a small view of current building. Add `/work` as the main professional portfolio, with an accessible web resume, project depth, skills in context, and PDF downloads. Use specific contributions and measured or qualified outcomes rather than promotional language.

- Preserve Astro, static output, Inter/monospace typography, navy/cyan identity, and both themes.
- Keep `/resume`, PDF styles, generated PDFs, and application/master resume sources independent of the website redesign.
- Use `resume.json` for shared identity, career facts, skills, and complete project descriptions. Add typed website editorial content with explicit references to resume projects; preserve employer and stage context.
- Use native HTML disclosures, meaningful process diagrams, and internal links for engagement. Keep essential contribution and outcome information visible without JavaScript.
- Feature personal work only where its public source establishes the claims. Do not expose private application/finance tools or imply that every current interest is a shipped project.
- Work locally on the requested branch. No hosting migration or deployment is part of this implementation.

## Phase 1: Foundation and content

- [x] Add typed portfolio content and stable project references, grounded in the resume/evidence inventory.
- [x] Share name, contact details, and role positioning across navigation, hero, metadata, and footer.
- [x] Add My Work navigation, accessible theme control, skip link, and consistent page shell.
- [x] Establish responsive, higher-contrast surfaces and typography; remove scroll snapping and automatic content flips.

Acceptance: existing routes still build, resume data/PDF rendering remain independent, navigation and contacts work with and without JavaScript.

## Phase 2: Home

- [x] Build a concise introduction, clear My Work/contact actions, and a restrained native visual.
- [x] Show three selected contributions with employer, stage, outcome, and links to their work stories.
- [x] Add verified public building/projects, a short working approach, and contact.

Acceptance: the first mobile screen communicates identity, capability, and the main action; all project claims and external links have evidence.

## Phase 3: My Work

- [x] Add `/work` with standard PDF and secondary ATS downloads.
- [x] Build three detailed selected stories with contribution, constraints, process, outcomes, technologies, and optional technical details.
- [x] Add a complete career overview with remaining projects and project/employer context.
- [x] Group skills and connect expertise to project evidence; include education and publications.

Acceptance: all original career/project/education/publication content remains accessible; stage and ownership stay explicit; disclosures work with keyboard and without JavaScript.

## Phase 4: Polish and verification

- [x] Refine blog listing/article typography, reading width, and shared layout.
- [x] Verify production build and whitespace; exercise routes, anchors, downloads, theme persistence, keyboard controls, reduced motion, no-JavaScript access, and narrow screens in a real browser.
- [x] Capture desktop/mobile light/dark screenshots and get an Astra design/code review; resolve actionable findings.
- [x] Update maintenance documentation and record validation and remaining limitations here.

Acceptance: no horizontal overflow, browser errors, broken local routes/anchors, hidden essential content, or inaccessible interactions in tested configurations. No changes to the source resume/PDF files.

## Validation record

Completed 2026-10-16.

- `npm run check:site`: production build passed; **282 browser checks passed** across Home, My Work, Writing, and an article at 320, 390, 768, and 1440 pixels in both themes.
- Verified route responses, local links and fragment targets, PDF MIME/content signatures, independent `/resume` route, unique headings/IDs, navigation fit, first-screen actions, reduced motion, keyboard skip/disclosure/theme controls, preference persistence, hover contrast, blocked storage, and no-JavaScript content/disclosures/email.
- Added content-retention checks: both employers and roles, all eight original project names and full descriptions, all 42 skills, education, and publications remain accessible. Expanded details fit a 320px viewport.
- Targeted source TypeScript check passed, as did JavaScript syntax validation and `git diff --check`.
- Full repository TypeScript check reports an existing Vite plugin type mismatch in untouched `astro.config.mjs` between the installed Astro and Tailwind dependency graphs. Production builds pass. Dependency versions and lockfile were preserved rather than masking the mismatch.
- GPT Astra reviewed the architecture, implementation, final desktop/mobile light/dark production screenshots, expanded details, and browser test script. No remaining must-fix findings. Fixed its reported mobile nav wrapping, dark button-hover contrast, and representative-skill selection issues.
- Production screenshots verified clean output without the development toolbar. Final screenshots live at `/tmp/emad-portfolio-final/`, including `home-desktop-light.png`, `home-mobile-dark.png`, `work-desktop-light.png`, and expanded-detail images. QA artifacts are outside source control.
- Public PomoCLI source and README were verified through the GitHub API before inclusion: <https://github.com/emadg/pomocli>. The illustration and example commands describe documented capabilities; no private projects were exposed.
- Confirmed no changes to public/master resume JSON, `/resume` source, PDF styles, or either downloadable PDF. Existing blog text was preserved.
- Builds and checks were small enough to run locally; no Yoga job or new project dependency was needed. A visible in-app browser was unavailable; all browser verification used local headless Chrome against the production build.

## Review and next use

The implementation is on `feat/home-and-work-portfolio`. Run `npm run dev` for interactive local review, or `npm run check:site` to reproduce production checks. No hosting migration, deployment, or push to `main` was performed.
