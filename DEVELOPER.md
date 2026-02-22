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
- Sets base body styles: `bg-slate-950`, white text, antialiased.
- Defines the `fade-in-up` animation and sequential delay classes.
- Defines 3D flip-card utilities: `perspective-1000`, `transform-style-3d`, `backface-hidden`, `rotate-y-180`.
- Defines `.card-inner` grid stacking (both front/back sides in `grid-area: 1/1`) for dynamic card height.

### `src/layouts/Layout.astro`

- Accepts `title` and optional `description` props.
- Renders the `<NetworkBackground />` as a fixed full-screen layer behind everything.
- Wraps the page content in a central frosted-glass panel:
  - `bg-slate-900/20` (low opacity dark background)
  - `backdrop-blur-[6px]` (light blur so the particle animation is subtly visible through it)
  - `max-w-5xl` (constrains width)
  - Full-height with `min-h-screen`
- Contains a minimal footer at the bottom of the panel.

### `src/components/NetworkBackground.astro`

Two layers:
1. A `<canvas>` element that renders animated particles.
2. A `<div>` overlay with an inline SVG fractal noise texture at very low opacity (`0.03`).

The `<script>` block:
- Creates `particleCount` particles (density: `innerWidth / 8`, max 250).
- Each particle is a dot with radius 1.5 to 4.0 px, colored cornflower blue (`rgba(100, 149, 237, 0.6)`).
- Particles drift slowly (speed 0.3) and bounce off edges.
- Lines are drawn between particles within 180px of each other, with opacity fading by distance.
- Runs via `requestAnimationFrame`.

**Tuning knobs:**
| Variable | Current | Effect |
|---|---|---|
| `particleCount` divisor | `8` | Lower = more particles |
| `connectionDistance` | `180` | Higher = more connecting lines |
| `particleSpeed` | `0.3` | Higher = faster movement |
| Particle `radius` | `1.5 - 4.0` | Dot size range |
| Dot color RGBA | `(100, 149, 237, 0.6)` | Cornflower blue |
| Line opacity multiplier | `0.2` | Subtlety of connection lines |

### `src/components/Hero.astro`

- Renders a pulsing cyan badge, the main headline (with gradient text), a summary paragraph, and social links (Email, GitHub, LinkedIn).
- All elements use the `fade-in-up` animation class with staggered delays.
- **To customize:** edit the text directly in the file, or update the `href` values for social links.

### `src/components/Resume.astro`

- Imports data from `src/data/resume.json` at build time.
- Renders a "Download Resume PDF" button linking to `/resume.pdf`.
- Builds a centered vertical timeline (`max-w-4xl`):
  - A thin gradient line runs down the center of the page.
  - Glowing cyan dots sit on the line for each entry.
  - Cards alternate left and right (`index % 2`).
  - Experience cards are 3D flip cards (dynamic height via CSS grid): front shows role/company/period/location, back shows detailed description.
  - Education cards appear after experience on the timeline (single-sided, no flip).
- Below the timeline: Skills (tag pills), Projects (two-column card grid), Publications (accent-border list).

**3D Flip Logic** (in the `<script>` block):
- An `IntersectionObserver` with `rootMargin: '-45% 0px -45% 0px'` fires when a card enters the middle 10% band of the viewport, toggling `rotate-y-180` on the `.card-inner` element.
- Mouse `mouseenter` also adds `rotate-y-180`.
- Mouse `mouseleave` only removes it if the card is NOT currently in the center intersection zone.

### `src/components/Nav.astro`

- Top navigation bar rendered inside `Layout.astro`, above the `<main>` content.
- Left side: "EG." monogram linking to home.
- Right side: "Home" and "Blog" links with active-state highlighting (cyan text + subtle bg).
- The "Blog" link is **conditionally rendered**: at build time it fetches the blog collection via `getCollection('blog')` and only shows the link if posts exist.
- Uses `Astro.url.pathname` to determine which link is active.

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

The accent color is **cyan** from Tailwind's default palette (`cyan-400`, `cyan-500`, etc.). Search globally for `cyan-` and replace with your preferred Tailwind color (e.g. `emerald-`, `violet-`, `amber-`).

### Change the background color tone

The page background is `bg-slate-950` (set in `global.css`). The `slate` palette is naturally blue-gray. To shift warmer, use `zinc-` or `neutral-`. To shift cooler/more blue, use `blue-` with high numbers.

### Adjust the frosted glass transparency

In `Layout.astro`, the central panel has two key classes:
- `bg-slate-900/20` - the `/20` is the opacity (0-100). Increase it to make the panel more opaque.
- `backdrop-blur-[6px]` - increase the pixel value for heavier blur, decrease for more transparency.

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

The site builds to a `dist/` folder of pure static files. It can be deployed to any static host:

- **Vercel**: `npx vercel` (auto-detects Astro)
- **Netlify**: Set build command to `npm run build`, publish directory to `dist`
- **GitHub Pages**: Use the `@astrojs/starlight` or a GitHub Action to build and deploy `dist/`
- **Cloudflare Pages**: Connect your repo, set build command `npm run build`, output `dist`
