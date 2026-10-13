# Emad Gohari - Personal Website & Portfolio

A modern, minimal personal website for an ML developer. Built with Astro and TailwindCSS, featuring an animated network particle background, a frosted-glass central panel, a 3D-flipping timeline resume, and **Dark/Light mode support**.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | [Astro](https://astro.build) | 5.x |
| Styling | [TailwindCSS](https://tailwindcss.com) | 4.x |
| Fonts | Inter + JetBrains Mono (site); Arial/Liberation Sans + Georgia (PDF) | Google Fonts CDN / local fonts |
| Language | TypeScript (strict) | - |

## Project Structure

```
src/
  components/
    Hero.astro              # Intro / landing section
    NetworkBackground.astro # Animated particle canvas + noise texture
    Resume.astro            # Timeline resume with 3D flip cards
  content/
    config.ts               # Astro content collection schema (blog)
    blog/                   # Blog posts go here as .md files
  data/
    resume.json             # Resume shown on the site and in the PDF
    master-resume.json      # Full evidence inventory with key facts (source for tailoring)
    schemas/                # JSON Schemas for both files (editor validation)
  lib/
    resume.ts               # Resume helpers: data loading, **bold** rendering, flattening
  layouts/
    Layout.astro            # Shared page shell: head, frosted panel, footer
  pages/
    index.astro             # Home page (Hero + Resume)
    resume.astro            # Print-optimized resume (used for PDF generation)
  styles/
    global.css              # Tailwind imports, fonts, animations, utilities
scripts/
    generate-pdf.mjs        # Puppeteer script: renders /resume → public/resume.pdf
public/
    resume.pdf              # Generated PDF resume (npm run pdf)
    favicon.svg             # Site favicon
```

## Updating Content

All resume content lives in **`src/data/resume.json`**. Edit the JSON and the site rebuilds automatically (no component changes needed). The file declares its schema (`src/data/schemas/resume.schema.json`), so VS Code validates it as you type.

Text in `summary`, experience `description`, and project `description`/`highlights` accepts `**bold**` markup. Use it for the key outcome of each project.

`src/data/master-resume.json` is the longer evidence inventory used to tailor applications (not rendered). Each project there has `key_facts`: claims with `strong_points`, `weak_points`, a `status` (supported / needs-verification / retracted), and an optional `metric`.

### Basics and summary

Name, headline, and contact details shown at the top of the PDF, followed by a short summary.

```json
"basics": {
  "name": "Your Name",
  "headline": "Senior Machine Learning Engineer",
  "location": "Toronto, ON, Canada",
  "email": "you@example.com",
  "github": "github.com/you",
  "linkedin": "linkedin.com/in/you",
  "website": "example.com"
},
"summary": "Two or three sentences tailored to the role, with **bold** highlights."
```

### Experience

Each entry appears as a flip card on the timeline (front: summary, back: description). In the PDF, each job is followed by its projects.

```json
{
  "company": "Company Name",
  "location": "City, Country",
  "role": "Your Title",
  "period": "Jan 2020 - Present",
  "description": "Short role and team context.",
  "projects": [ /* see Projects */ ]
}
```

### Education

Each entry appears on the timeline below experience (no flip, single-sided card).

```json
{
  "institution": "University Name",
  "location": "City, Country",
  "degree": "M.Sc. in Computer Science",
  "grade": "3.9 / 4.0",
  "period": "2016 - 2020",
  "note": "Thesis title or other note (set to null to omit)"
}
```

### Skills

Grouped by category. The PDF shows one line per category near the top; the site shows all items as tags.

```json
"skills": [
  { "category": "LLM & Agentic AI", "items": ["Large Language Models", "PydanticAI"] },
  { "category": "Data & Cloud", "items": ["AWS", "Apache Spark"] }
]
```

### Projects

Nested under the job they belong to. In the default PDF, each is a plain indented entry under its job: title followed by a bracketed stage label (e.g. `[PRODUCTION]`), a right-aligned period, description, optional bullets, and a "Tech & Skills" line. Each job introduces its projects with a "Work Projects" heading; standard bullet characters mark project titles, and a thin line separates employers. ATS also includes the "Work Projects" heading and simple bullets before project titles, while putting dates and stages below titles and removing indentation. The site also lists all projects together in a grid.

`stage` is one of `production` (used by real customers), `internal`, `prototype`, `poc`, or `research`. `highlights` is optional and renders as bullets.

```json
{
  "name": "Project Name",
  "period": "2024",
  "stage": "production",
  "description": "What was built, how, and the **measured impact**.",
  "highlights": ["Optional bullet"],
  "tech": ["Python", "AWS"]
}
```

### Publications

Each publication appears as a title followed by venue, year, and an optional note in the PDF.

```json
{
  "title": "Paper Title",
  "venue": "Conference or Journal Name",
  "year": "2020",
  "note": "co-authored"
}
```

### Links (Hero & Footer)

Social links (GitHub, LinkedIn, email) are hardcoded in two files:

- **`src/components/Hero.astro`** — hero section links
- **`src/layouts/Layout.astro`** — footer links

Search for `href=` to find and update the URLs.

### PDF Resume

The PDF is auto-generated from `resume.json` via a print-optimized Astro page (`src/pages/resume.astro`) and Puppeteer.

**Prerequisite:** Google Chrome (or Chromium) must be installed on your system. The script auto-detects common install locations on macOS, Linux, and Windows. You can also set `CHROME_PATH` to a custom location:

```bash
# Balanced default layout: public/resume.pdf
npm run pdf

# Linear ATS layout: public/resume-ats.pdf
npm run pdf -- --ats

# Or specify a custom Chrome path
CHROME_PATH="/path/to/chrome" npm run pdf

# Custom output file or directory (--dir uses resume-ats.pdf with --ats)
npm run pdf -- --out ./build/my-cv.pdf
npm run pdf -- --dir ./exports
npm run pdf -- --ats --dir ./exports
PDF_OUT=./out.pdf npm run pdf

# Render a different (e.g. tailored) resume JSON without touching src/data/resume.json
npm run pdf -- --data ./applications/acme/resume.json --out ./applications/acme/resume.pdf
npm run pdf -- --ats --data ./applications/acme/resume.json --out ./applications/acme/resume-ats.pdf
npm run pdf -- --help

# Auto-fit is on for the default layout; ATS uses 100% unless --zoom is supplied
npm run pdf -- --no-fit
npm run pdf -- --zoom 0.97
```

**Layouts:** the default PDF keeps contact icons, divider lines, section accents, inline bold emphasis, right-aligned dates, and plain stage labels after project titles. Projects have no boxes, shading, or enclosing borders. The ATS PDF uses a left-aligned text flow, a "Contact Info" block with bold colon labels (Email, GitHub, LinkedIn, Website, then Location), stacked dates, "Work Projects" headings, simple project-title bullets, no decorative rules or indentation, and plain text instead of inline emphasis. Both preserve all content and use local fonts. The default has a 24 pt name, 13 pt section headings, 11.5 pt job titles, 10.5 pt project/publication titles, 10 pt body text, and 9 pt metadata. ATS uses 14.5 pt section headings prefixed with a literal ASCII `>` (for example, `> Experience`), 11 pt body text, and 10 pt metadata. Both allow additional pages for readability. ATS mode improves text extraction; it does not guarantee compatibility with every vendor parser.

**Auto-fit:** for the default layout, before printing, the script simulates where pages break and scales the whole page very slightly (between 94% and 103%) to prefer fewer pages, then reduce blank space at the bottom of every page except the last, without adding pages. It prints the blank space per page before and after. Limits are in `FIT` in `scripts/generate-pdf.mjs`; typography, gaps, and indents live in `src/pages/resume.astro` and apply to both browser preview and PDF output. Projects taller than 30% of a printable page can split during PDF generation, avoiding large gaps while keeping shorter projects together.

This starts its own dev server on port 4399 (`--port` to change; it refuses to run if the port is busy), renders `/resume` to a Letter-size PDF, saves it to `public/resume.pdf` (or `public/resume-ats.pdf` with `--ats`) by default, and shuts down. Explicit `--out`, positional output paths, and `PDF_OUT` keep their existing behavior. The download button on the site serves this file as `EmadGohari_MLE_CV_2026.pdf`. To change the download filename, edit the `download` attribute in `src/components/Resume.astro`.

Preview the default layout at `http://localhost:4321/resume` with `npm run dev`, or start `RESUME_LAYOUT=ats npm run dev` to preview ATS. The PDF command always chooses its layout through `--ats`, regardless of an inherited `RESUME_LAYOUT` value. PDFs contain selectable, tagged text and no browser-generated headers or footers.

## Adding a Blog Post

Create a Markdown file in `src/content/blog/`, e.g. `src/content/blog/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "A short summary."
pubDate: 2026-03-01
tags: ["ml", "python"]
---

Your content here. Code blocks with syntax highlighting work out of the box.
```

The blog listing page (`/blog`) and post layout are already built. Posts appear automatically.

## Deployment

The site auto-deploys to **GitHub Pages** and **Cloudflare Pages** on every push to `main`.

| Host | URL | Setup |
|------|-----|-------|
| GitHub Pages | `emadg.github.io` | Repo → Settings → Pages → Source: **GitHub Actions** |
| Cloudflare Pages | `<project>.pages.dev` | Connect repo in Cloudflare dashboard, build cmd: `npm run build`, output: `dist` |

See DEVELOPER.md for detailed setup instructions and custom domain configuration.

## License

Copyright (c) 2026 Emad Gohari. All rights reserved.

This project is proprietary. Unauthorized copying, modification, distribution, or use is strictly prohibited.
