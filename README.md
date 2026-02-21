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
    resume.json             # All resume data (experience, education, skills)
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

## Updating Your Resume

Edit `src/data/resume.json`. The file has three top-level keys:

- **experience** - Array of `{ company, role, period, description }` objects.
- **education** - Array of `{ institution, degree, period }` objects.
- **skills** - Array of skill name strings.

No HTML or component code needs to change. Just save the JSON file and rebuild.

## Replacing the PDF Resume

Drop your real PDF into `public/resume.pdf`. The download button will serve it as `EmadGohari_MLE_CV_2026.pdf` regardless of the source filename.

## Adding a Blog Post (Future)

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
