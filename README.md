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
| Fonts | Inter (body), JetBrains Mono (code) | Google Fonts CDN |
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
    resume.json             # All resume data (single source of truth)
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

All resume content lives in **`src/data/resume.json`**. Edit the JSON and the site rebuilds automatically (no component changes needed).

### Experience

Each entry appears as a flip card on the timeline (front: summary, back: description).

```json
{
  "company": "Company Name",
  "location": "City, Country",
  "role": "Your Title",
  "period": "Jan 2020 - Present",
  "description": "What you did and the impact you made."
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

A flat array of strings displayed as tags.

```json
"skills": ["Python", "PyTorch", "Docker"]
```

### Projects

Each entry appears as a card in a two-column grid.

```json
{
  "name": "Project Name",
  "year": "2024",
  "description": "Brief description of the project.",
  "tech": ["Python", "AWS"]
}
```

### Publications

Each entry appears in a list with a left accent border.

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
# Uses system Chrome automatically
npm run pdf

# Or specify a custom Chrome path
CHROME_PATH="/path/to/chrome" npm run pdf
```

This starts the dev server, renders `/resume` to a Letter-size PDF, saves it to `public/resume.pdf`, and shuts down. The download button on the site serves this file as `EmadGohari_MLE_CV_2026.pdf`. To change the download filename, edit the `download` attribute in `src/components/Resume.astro`.

You can also preview the print layout in your browser at `http://localhost:4321/resume` while the dev server is running.

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

Private. All rights reserved.
