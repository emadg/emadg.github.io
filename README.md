# Emad Gohari - Personal Website & Portfolio

A modern, minimal personal website for an ML developer. Built with Astro and TailwindCSS, featuring an animated network particle background, a frosted-glass central panel, and a 3D-flipping timeline resume.

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
    blog/                   # Future blog posts go here as .md files
  data/
    resume.json             # All resume data (experience, education, skills, projects, publications)
  layouts/
    Layout.astro            # Shared page shell: head, frosted panel, footer
  pages/
    index.astro             # Home page (Hero + Resume)
  styles/
    global.css              # Tailwind imports, fonts, animations, utilities
public/
    resume.pdf              # Downloadable PDF resume (replace with real file)
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

Drop your file into `public/resume.pdf`. The download button serves it as `EmadGohari_MLE_CV_2026.pdf` regardless of the source filename. To change the download filename, edit the `download` attribute in `src/components/Resume.astro`.

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

A blog listing page and post layout still need to be built (see DEVELOPER.md).

## License

Private. All rights reserved.
