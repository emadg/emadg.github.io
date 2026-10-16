# Emad Gohari — Personal Website & Portfolio

A static Astro portfolio with a concise landing page, a detailed **My Work** page, writing, and independent print-ready resume exports. The site uses a restrained navy/cyan palette, Inter and monospace typography, accessible native disclosures, and light/dark themes.

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

Astro serves development at `http://localhost:4321`. Production output is `dist/`.

## Pages

| Route          | Purpose                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `/`            | Introduction, selected contributions, public personal project, working approach, and contact               |
| `/work`        | Project stories, complete career history, grouped expertise, education, publications, and resume downloads |
| `/blog`        | Writing index                                                                                              |
| `/blog/<slug>` | Article with a focused reading layout                                                                      |
| `/resume`      | Independent print source used by the PDF generator                                                         |

## Content and architecture

- **`src/data/resume.json`** is the public resume source: identity, contacts, experience, projects, skill categories, education, and publications. Its JSON Schema provides editor validation. It supplies both the web portfolio and PDF source.
- **`src/data/portfolio.ts`** holds website-specific storytelling and explicit references to resume projects. It supplies selected contributions, workflow illustrations, expertise/evidence links, and a verified public personal project. Missing project/skill references fail the build instead of silently dropping content.
- **`src/data/master-resume.json`** is the full evidence inventory for tailoring applications. It is not imported into the public website.
- **`src/content/blog/`** contains Markdown posts.
- **`src/styles/global.css`** defines shared tokens, responsive layouts, and reading typography. PDF styling stays separate in `resume-default.css` and `resume-ats.css`.

Full project descriptions and technologies remain accessible through native HTML disclosures. Featured projects retain employer, date, and deployment-stage context. Essential content, links, downloads, and disclosures work without JavaScript. Small scripts handle theme preference, directly linked project disclosures, optional background motion, and reading progress. The visual-experiment branches restore restrained frosted surfaces and an anchored point grid; motion can be paused and stays static for reduced-motion preferences and touch input.

The **Aa** control beside the theme button toggles between normal and 25% larger website text. The preference persists across pages when storage is available; browser zoom and font settings continue working. It applies to Home, My Work, Writing, and articles without changing the resume PDFs.

The original content redesign is documented in [Portfolio improvements](docs/portfolio-improvements.md). The new visual directions and their comparison are in [Interactive glass experiments](docs/visual-experiments.md). See [DEVELOPER.md](DEVELOPER.md) for maintenance details.

## Updating the website

Edit shared facts in `resume.json`. Use `**bold**` in summaries, descriptions, and highlights for inline emphasis. When adding or renaming a project, update its stable website ID/reference in `portfolio.ts`. Home links, selected stories, and expertise links must point to an existing work entry.

The homepage role, page title, and description use `resume.json`; the landing introduction and project stories use the approved website copy in `portfolio.ts` and `Hero.astro`. After updating the public resume, regenerate both downloads with `npm run pdf` and `npm run pdf -- --ats` before building the site.

Keep the `master-resume-updates` branch and its `.worktrees/master-resume-updates` worktree for ongoing evidence additions. Record confirmed facts there, update the public resume when appropriate, and open a PR into `main` when ready. After each PR merges, fetch and merge `origin/main` into the clean worktree before the next round of changes; retain the branch and worktree rather than deleting them.

For website copy and public personal projects, update `portfolio.ts`. Verify source repositories are public and descriptions reflect their actual capabilities. Do not import local application notes or private project data into website content.

To add writing, create `src/content/blog/my-post.md`:

```markdown
---
title: "My Post"
description: "A short summary."
pubDate: 2026-10-16
tags: ["Machine Learning", "Engineering"]
---

Article content here.
```

### Resume tailoring

The `tailor-resume` skill, agent metadata, and application-notes template are maintained in the sibling `apply-assist-dash` repository at `.agents/skills/tailor-resume`. This website does not track a separate copy. To make the shared skill available from a website checkout or worktree, run these commands from that checkout, substituting the actual dashboard path:

```bash
mkdir -p .agents/skills .claude/skills
ln -s /path/to/apply-assist-dash/.agents/skills/tailor-resume .agents/skills/tailor-resume
ln -s ../../.agents/skills/tailor-resume .claude/skills/tailor-resume
```

Create a link only when that destination is absent; inspect existing files or links before replacing them. The shared skill resolves its real location before using the dashboard's private profile, schemas, layout reference, and renderer. Website synchronization remains an explicit step using `master-resume-updates`. The local skill link and `.claude/` configuration are ignored by Git; a fresh clone builds without them.

## Browser verification

```bash
npm run check:site

# Optional: retain desktop/mobile light/dark screenshots outside source control
SITE_QA_SCREENSHOTS=/tmp/portfolio-qa npm run check:site

# Specify a browser if it is not found automatically
CHROME_PATH=/path/to/chrome npm run check:site
```

Uses the existing `puppeteer-core` dependency and system Chrome/Chromium. It builds the site, serves `dist/` on an ephemeral local port, and checks the four portfolio/writing routes at 320, 390, 768, and 1440 pixels in both themes. Checks include local links/anchors, PDFs, overflow, keyboard controls, theme persistence, reduced motion, and JavaScript/storage fallbacks. Chrome must support the host sandbox; constrained test containers can explicitly set `CHROME_NO_SANDBOX=1` for their isolated browser process. The owned browser and server close when the checks finish.

## PDF resumes

The website redesign does not change resume content, PDF styles, or generated files. The primary download on My Work serves `public/resume.pdf`; the secondary download serves `public/resume-ats.pdf`.

```bash
npm run pdf
npm run pdf -- --ats
npm run pdf -- --ats --compact

# Tailored input without changing the public resume
npm run pdf -- --data /path/to/resume.json --out /path/to/resume.pdf
npm run pdf -- --ats --data /path/to/resume.json --out /path/to/resume-ats.pdf

# Other output and fitting controls
npm run pdf -- --dir ./exports
npm run pdf -- --no-fit
npm run pdf -- --zoom 0.97
npm run pdf -- --help
```

Requires installed Chrome/Chromium; `CHROME_PATH` overrides detection. The PDF command starts an isolated dev server (default port 4399, adjustable with `--port`) and closes it after export. `--ats` selects the linear layout; `--compact` requires `--ats`. The default layout auto-fits within 94–103%; ATS stays at 100% unless `--zoom` is supplied. Both use selectable, tagged text and locally installed fonts.

See [Resume PDF layouts](docs/resume-layouts.md) for layout details, settings, application-specific results, and reproduction guidance. Local application materials are excluded from source control.

## Deployment

Existing hosting remains GitHub Pages and Cloudflare Pages. The GitHub Actions workflow builds and deploys on pushes to `main`; Cloudflare uses `npm run build` with output `dist`. The redesign branch can be reviewed locally before merging.

## License

Copyright © 2026 Emad Gohari. All rights reserved. This project is proprietary; unauthorized copying, modification, distribution, or use is prohibited.
