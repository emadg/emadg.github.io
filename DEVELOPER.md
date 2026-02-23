# Developer Guide

This document explains how the site is architected, how to modify its visual design, and how to extend it with new features.

## Architecture Overview

The site is built with **Astro** in Static Site Generation (SSG) mode. Every page is pre-rendered to static HTML at build time, meaning zero JavaScript is shipped to the browser except for two small scripts that power the canvas animation and the flip-card interactions.

```
Browser Request
     |
     v
  Static HTML + CSS  (from dist/)
     |
     +--> NetworkBackground.astro <script>  (Canvas particle animation, runs on load)
     +--> Resume.astro <script>             (IntersectionObserver + hover flip logic)
```

### Key Design Decisions

- **No React / Vue / Svelte dependency.** All components are `.astro` files (server-rendered HTML templates). The two `<script>` tags in `NetworkBackground.astro` and `Resume.astro` are vanilla TypeScript. This keeps the bundle tiny and avoids framework lock-in.
- **Content separated from presentation.** Resume data lives in `src/data/resume.json`. Blog posts will live in `src/content/blog/` as Markdown files. The owner never needs to touch `.astro` or `.css` files to update content.
- **TailwindCSS v4** is used via the Vite plugin (`@tailwindcss/vite`). There is no `tailwind.config.js`; configuration is done inline in `src/styles/global.css` using the `@theme` directive.
- **Single-source PDF generation.** `src/pages/resume.astro` renders a print-optimized HTML page from `resume.json`. The `scripts/generate-pdf.mjs` script uses `puppeteer-core` (lightweight, no bundled browser) to print it to `public/resume.pdf` via the system's Chrome installation.

## File-by-File Reference

### `src/styles/global.css`

- Imports Google Fonts (Inter + JetBrains Mono) and TailwindCSS.
- Defines custom font families in the `@theme` block.
- **Defines Semantic Color Tokens**: Maps generic names (e.g., `--color-bg-body`) to specific values for Light (`:root`) and Dark (`:root.dark`) modes.
- Sets base body styles using these semantic tokens.
- Defines the `fade-in-up` animation and sequential delay classes.
- Defines 3D flip-card utilities and `.card-inner` grid stacking.
- Defines the `.theme-transition` class for smooth color swapping.

### `src/layouts/Layout.astro`

- Accepts `title` and optional `description` props.
- **Theme Logic**: Includes an inline `<script>` in `<head>` to prevent Flash of Wrong Theme (FOWT). It checks `localStorage` or `prefers-color-scheme` and applies the `.dark` class immediately.
- Renders the `<NetworkBackground />` as a fixed full-screen layer.
- Wraps content in a central frosted-glass panel using semantic background/border tokens.
- Uses `transform-gpu` to ensure smooth rendering of the backdrop blur.

### `src/components/NetworkBackground.astro`

Two layers:
1. A `<canvas>` element that renders animated particles.
2. A `<div>` overlay with an inline SVG fractal noise texture.

The `<script>` block:
- Creates particles that drift and connect with lines.
- **Theme Reactivity**: Observes the `<html>` element for class changes. When the theme toggles, it smoothly interpolates the particle colors (Cornflower Blue for dark, Darker Blue for light) over ~400ms.

### `src/components/Hero.astro`

- Renders a pulsing accent badge, headline, summary, and social links.
- Uses semantic color tokens (e.g., `text-text-primary`, `text-text-muted`) to adapt to the active theme.

### `src/components/Resume.astro`

- Imports data from `src/data/resume.json`.
- Builds the timeline, skills, and project sections using semantic tokens for backgrounds, borders, and text.
- 3D Flip Logic remains the same, but card styles now adapt to light/dark mode.

### `src/components/Nav.astro`

- Top navigation bar.
- **Theme Toggle**: Includes a sun/moon button that toggles the `.dark` class on `<html>`, saves the preference to `localStorage`, and triggers a temporary `.theme-transition` class for smooth animation.

### `src/content/config.ts`

Defines an Astro content collection called `blog` with a Zod schema:
- `title` (string, required)
- `description` (string, required)
- `pubDate` (date, required)
- `tags` (string array, optional)

### `src/pages/resume.astro`

- Print-optimized HTML resume page that reads all data from `resume.json`.
- Uses vanilla CSS (no Tailwind) for precise print control: Inter font, Letter-size `@page` rule, proper margins.
- Sections: header (name + title), experience, education, projects (two-column grid), publications, skills.
- Accessible at `/resume` during development for previewing before PDF generation.
- **Not linked from the main site navigation** — it exists solely as a PDF source.

### `scripts/generate-pdf.mjs`

- Node.js script that generates `public/resume.pdf` from the `/resume` page.
- Uses `puppeteer-core` (dev dependency) with the system's Chrome/Chromium — no bundled browser download.
- Auto-detects Chrome on macOS, Linux, and Windows. Override with `CHROME_PATH` env var.
- Workflow: starts Astro dev server → waits for it → opens headless Chrome → prints to PDF → shuts down.
- Run via `npm run pdf`.

### `src/pages/blog/index.astro`

- Blog listing page at `/blog`.
- Fetches all posts via `getCollection('blog')`, sorts newest first.
- Each post renders as a card showing title, date, description, and tags.
- Links to `/blog/[slug]/` (the `.md` extension is stripped from `post.id` for clean URLs).

### `src/pages/blog/[slug].astro`

- Dynamic route for individual blog posts.
- Uses `getStaticPaths()` to generate one page per post.
- Renders post content using Astro's `render()` function inside a `.prose` container.
- Includes a "Back to blog" link, post header with title/date/tags, and the full rendered Markdown.

## Common Tasks

### Change the color accent

The accent color is defined in `src/styles/global.css` under the `:root` and `:root.dark` blocks. Look for `--accent`, `--accent-hover`, and `--accent-bg`. Change the hex codes to your preferred color (e.g., Emerald, Violet).

### Change the background color tone

The page background is defined in `src/styles/global.css` as `--bg-body`.
- **Light Mode**: Defaults to `#f1f5f9` (Slate 100).
- **Dark Mode**: Defaults to `#020617` (Slate 950).
Update these values to shift the tone (e.g., to Zinc or Neutral).

### Adjust the frosted glass transparency

In `src/styles/global.css`, adjust the `--bg-panel` variable:
- **Light Mode**: `rgba(255, 255, 255, 0.4)`
- **Dark Mode**: `rgba(15, 23, 42, 0.2)`
To change the blur amount, edit `src/layouts/Layout.astro` and look for `backdrop-blur-[5px]`.

### Add a new page

Create a new `.astro` file in `src/pages/`, e.g. `src/pages/projects.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Projects">
  <h1>My Projects</h1>
</Layout>
```

It will automatically be available at `/projects`.

### Add a new blog post

Create a `.md` file in `src/content/blog/` with this frontmatter:

```markdown
---
title: "Your Post Title"
description: "A short summary for the listing page."
pubDate: 2026-03-01
tags: ["tag-one", "tag-two"]
---

Your Markdown content here...
```

The post will appear automatically on the `/blog` page and at `/blog/your-file-name/`. The "Blog" nav link will also appear once at least one post exists. Astro's built-in Shiki integration handles syntax-highlighted code blocks automatically.

## Deployment

The site builds to a `dist/` folder of pure static files. It is currently configured to deploy to **GitHub Pages** and **Cloudflare Pages** simultaneously from the same repo.

### GitHub Pages (automatic)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) handles this automatically:

1. Push to `main` → workflow triggers
2. Installs deps, runs `npm run build`
3. Deploys `dist/` to GitHub Pages

**One-time setup in GitHub:**
1. Go to your repo → **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to **GitHub Actions**
3. That's it — the next push to `main` will deploy to `https://emadg.github.io`

The repo should be named `emadg.github.io` (matching your GitHub username) so the site is served at `https://emadg.github.io`.

### Cloudflare Pages (automatic)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Connect your GitHub account and select this repo
3. Configure the build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: Set env var `NODE_VERSION` = `20`
4. Click **Save and Deploy**

Cloudflare will auto-deploy on every push to `main`. Your site will be available at `<project-name>.pages.dev`.

### Custom domain

Both hosts support custom domains for free:

- **Cloudflare Pages**: Project settings → Custom domains → Add domain → update your DNS nameservers to Cloudflare
- **GitHub Pages**: Repo settings → Pages → Custom domain → add a `CNAME` DNS record pointing to `emadg.github.io`

### Other hosts

The `dist/` folder works with any static host:

- **Vercel**: `npx vercel` (auto-detects Astro)
- **Netlify**: Set build command to `npm run build`, publish directory to `dist`
