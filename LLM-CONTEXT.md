# LLM Context: Emad Gohari Personal Website

Use this document as a starting prompt when resuming development on this project with an AI coding assistant.

## What This Project Is

A personal website and portfolio for Emad Gohari, a Senior Research Engineer specializing in NLP & Machine Learning. It is a static site built with **Astro 5.x** and **TailwindCSS 4.x** using TypeScript in strict mode. The site has a dark, blue-gray aesthetic with a frosted-glass central panel over an animated particle-network canvas background.

## Current State (as of Feb 2026)

**Implemented:**
- Animated particle-network canvas background (`src/components/NetworkBackground.astro`)
- Frosted-glass central content panel in the layout (`src/layouts/Layout.astro`, `max-w-5xl`)
- Hero / intro section with fade-in animations (`src/components/Hero.astro`)
- Resume section with a centered vertical timeline using 3D flip cards (`src/components/Resume.astro`)
- Dynamic-height flip cards using CSS grid stacking (no fixed height, no scrolling)
- Education entries on the timeline (single-sided, no flip) below experience entries
- Skills, projects, and publications sections below the timeline
- Resume data externalized to JSON (`src/data/resume.json`) — single source of truth
- Print-optimized resume page (`src/pages/resume.astro`) for PDF generation
- PDF generation script using `puppeteer-core` + system Chrome (`scripts/generate-pdf.mjs`, `npm run pdf`)
- Downloadable PDF resume button (downloads as `EmadGohari_MLE_CV_2026.pdf`)
- Blog content collection schema defined (`src/content/config.ts`)
- Navigation header with conditional blog link (`src/components/Nav.astro`)
- Blog listing page at `/blog` (`src/pages/blog/index.astro`)
- Blog post pages with dynamic routing at `/blog/[slug]` (`src/pages/blog/[slug].astro`)
- Prose/typography styles for rendered Markdown blog content (`global.css`)
- Sample blog post (`src/content/blog/building-ml-pipelines.md`)
- Custom "EG" monogram favicon with cyan-to-blue gradient (`public/favicon.svg`)
- **Dark/Light mode toggle** with smooth transitions and system preference detection

**Not yet implemented:**
- SEO meta tags (Open Graph, Twitter cards)
- Mobile-optimized timeline (cards currently use 50% width which is narrow on phones)

## File Map

```
astro.config.mjs            # Astro config, only enables @tailwindcss/vite plugin
tsconfig.json                # Extends astro/tsconfigs/strict
package.json                 # Deps: astro, tailwindcss, @tailwindcss/vite; devDeps: puppeteer-core

src/
  styles/global.css          # TailwindCSS imports, @theme (fonts), base styles, animation keyframes, 3D flip utilities, card-inner grid, prose typography
  layouts/Layout.astro       # Page shell: <head>, NetworkBackground, Nav, frosted panel (bg-slate-900/20, backdrop-blur-[6px], max-w-5xl), footer
  components/
    NetworkBackground.astro  # Fixed <canvas> with particle animation + SVG noise texture overlay
    Nav.astro                # Top navigation bar; conditionally shows Blog link when blog posts exist
    Hero.astro               # Landing section: badge, headline with gradient text, summary, social links (email, GitHub, LinkedIn)
    Resume.astro             # Timeline with 3D flip cards (experience) and single-sided cards (education), skills tags, projects grid, publications list, PDF download button
  data/
    resume.json              # { experience, education, skills, projects, publications }
  content/
    config.ts                # Astro content collection: blog (title, description, pubDate, tags)
    blog/                    # Markdown blog posts (add .md files here to populate the blog)
  pages/
    index.astro              # Composes Layout > Hero > Resume
    resume.astro             # Print-optimized HTML resume for PDF generation (not linked from nav)
    blog/
      index.astro            # Blog listing page, sorted by date descending
      [slug].astro           # Individual blog post page with prose-styled Markdown rendering

scripts/
    generate-pdf.mjs         # Puppeteer script: starts dev server, renders /resume → public/resume.pdf via system Chrome

public/
    resume.pdf               # Generated PDF resume (run `npm run pdf` to regenerate)
    favicon.svg              # "EG" monogram favicon with cyan-to-blue gradient on dark slate background
```

## Design Language

- **Background**: Animated canvas with particle network.
  - **Dark Mode**: `bg-slate-950` with cornflower-blue particles (`rgba(100, 149, 237, 0.6)`).
  - **Light Mode**: `bg-slate-100` (`#f1f5f9`) with darker blue particles (`rgba(30, 64, 175, 0.7)`) for contrast.
- **Central panel**: Frosted-glass effect.
  - **Dark Mode**: `bg-slate-900/20`, `backdrop-blur-[5px]`.
  - **Light Mode**: `bg-white/40`, `backdrop-blur-[4px]`.
  - Bordered on left/right by subtle borders (`border-slate-700/30` or `border-slate-300`). Max width `max-w-5xl`.
- **Accent color**: Cyan (`cyan-400`/`cyan-600`) used for badges, glows, hover states, timeline dots.
- **Typography**: Inter (sans-serif, body text), JetBrains Mono (monospace, dates/code). Loaded via Google Fonts CDN.
- **Animations**: CSS `fade-in-up` keyframes with staggered delays. Canvas animation runs via `requestAnimationFrame`. Smooth theme transitions (~400ms) on toggle.
- **Resume cards**: CSS grid stacking (`.card-inner` uses `display: grid` with both sides in `grid-area: 1/1`) for dynamic height. 3D CSS transforms (`perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, `rotateY(180deg)`). Flip triggers: hover and IntersectionObserver when card enters center 10% of viewport.

## Key Technical Details

- TailwindCSS v4 uses the Vite plugin (`@tailwindcss/vite`), NOT a `tailwind.config.js` file.
- **Theming**: Implemented via CSS custom properties (variables) in `src/styles/global.css`. Semantic tokens (e.g., `--bg-body`, `--text-primary`) map to different values for `:root` (light) and `:root.dark`.
- **Theme Toggle**: `Nav.astro` contains the toggle button. `Layout.astro` includes an inline script to prevent flash-of-wrong-theme (FOWT) by checking `localStorage` or system preference before render.
- There are NO React/Vue/Svelte dependencies. Components are all `.astro` (server-rendered). Client-side interactivity is vanilla TypeScript in `<script>` tags.
- Resume data is imported as JSON at build time (`import resumeData from '../data/resume.json'`), not fetched at runtime.
- The blog content collection uses Astro's legacy `type: 'content'` API. `post.id` includes the `.md` extension and must be stripped for clean URLs.
- The `Nav.astro` component fetches the blog collection at build time; the "Blog" link only appears when at least one post exists in `src/content/blog/`.
- Astro's built-in Shiki handles code syntax highlighting in blog posts.
- PDF generation uses `puppeteer-core` (dev dependency, no bundled browser) with the system's Chrome. Auto-detects on macOS/Linux/Windows; overridable via `CHROME_PATH` env var.

## Owner Preferences

- **Aesthetic**: Dark, minimal, clean. Not crammed. Easy to read. Subtle animations only where they feel natural, not everywhere.
- **Maintenance**: The owner has limited JS/frontend experience. Content changes (resume, blog) should not require touching component code. JSON and Markdown are the primary content formats.
- **PDF Resume**: Auto-generated from `resume.json` via `npm run pdf`. Single source of truth — both the website and PDF read from the same JSON file.

## When Continuing Development

1. Read this file first for full context.
2. Check `src/data/resume.json` to see if the owner has updated their content.
3. Check `src/content/blog/` to see if any posts have been added.
4. Run `npm run dev` to start the local server at `http://localhost:4321`.
5. Run `npm run build` to verify everything compiles cleanly before finishing.
6. Keep changes minimal and consistent with the existing design language described above.
