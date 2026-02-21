# LLM Context: Emad Gohari Personal Website

Use this document as a starting prompt when resuming development on this project with an AI coding assistant.

## What This Project Is

A personal website and portfolio for Emad Gohari, a professional Machine Learning developer. It is a static site built with **Astro 5.x** and **TailwindCSS 4.x** using TypeScript in strict mode. The site has a dark, blue-gray aesthetic with a frosted-glass central panel over an animated particle-network canvas background.

## Current State (as of Feb 2026)

**Implemented:**
- Animated particle-network canvas background (`src/components/NetworkBackground.astro`)
- Frosted-glass central content panel in the layout (`src/layouts/Layout.astro`)
- Hero / intro section with fade-in animations (`src/components/Hero.astro`)
- Resume section with a centered vertical timeline using 3D flip cards (`src/components/Resume.astro`)
- Resume data externalized to JSON (`src/data/resume.json`)
- Downloadable PDF resume button (downloads as `EmadGohari_MLE_CV_2026.pdf`)
- Education and skills sections below the timeline
- Blog content collection schema defined (`src/content/config.ts`)
- Navigation header with conditional blog link (`src/components/Nav.astro`)
- Blog listing page at `/blog` (`src/pages/blog/index.astro`)
- Blog post pages with dynamic routing at `/blog/[slug]` (`src/pages/blog/[slug].astro`)
- Prose/typography styles for rendered Markdown blog content (`global.css`)
- Sample blog post (`src/content/blog/building-ml-pipelines.md`)

**Not yet implemented:**
- Projects section
- SEO meta tags (Open Graph, Twitter cards)
- Dark/light mode toggle (currently dark-only)
- Mobile-optimized timeline (cards currently use 50% width which is narrow on phones)

## File Map

```
astro.config.mjs            # Astro config, only enables @tailwindcss/vite plugin
tsconfig.json                # Extends astro/tsconfigs/strict
package.json                 # Deps: astro, tailwindcss, @tailwindcss/vite

src/
  styles/global.css          # TailwindCSS imports, @theme (fonts), base styles, animation keyframes, 3D flip utilities, prose typography
  layouts/Layout.astro       # Page shell: <head>, NetworkBackground, Nav, frosted panel (bg-slate-900/20, backdrop-blur-[6px]), footer
  components/
    NetworkBackground.astro  # Fixed <canvas> with particle animation + SVG noise texture overlay
    Nav.astro                # Top navigation bar; conditionally shows Blog link when blog posts exist
    Hero.astro               # Landing section: badge, headline with gradient text, summary, social links
    Resume.astro             # Timeline with 3D flip cards (IntersectionObserver + hover), education list, skills tags, PDF download button
  data/
    resume.json              # { experience: [...], education: [...], skills: [...] }
  content/
    config.ts                # Astro content collection: blog (title, description, pubDate, tags)
    blog/                    # Markdown blog posts (add .md files here to populate the blog)
  pages/
    index.astro              # Composes Layout > Hero > Resume
    blog/
      index.astro            # Blog listing page, sorted by date descending
      [slug].astro           # Individual blog post page with prose-styled Markdown rendering

public/
    resume.pdf               # Placeholder PDF (owner should replace with real resume)
    favicon.svg              # Default Astro favicon
```

## Design Language

- **Background**: `bg-slate-950` with an animated canvas of cornflower-blue particles (`rgba(100, 149, 237, 0.6)`) connected by fading lines.
- **Central panel**: `bg-slate-900/20`, `backdrop-blur-[6px]`, bordered on left/right by `border-slate-700/30`. Max width `max-w-4xl`.
- **Accent color**: Cyan (`cyan-400`, `cyan-500`) used for badges, glows, hover states, timeline dots.
- **Typography**: Inter (sans-serif, body text), JetBrains Mono (monospace, dates/code). Loaded via Google Fonts CDN.
- **Animations**: CSS `fade-in-up` keyframes with staggered delays. Canvas animation runs via `requestAnimationFrame`.
- **Resume cards**: 3D CSS transforms (`perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, `rotateY(180deg)`). Flip triggers: hover and IntersectionObserver when card enters center 10% of viewport.

## Key Technical Details

- TailwindCSS v4 uses the Vite plugin (`@tailwindcss/vite`), NOT a `tailwind.config.js` file. Custom theme tokens go in `@theme {}` inside `global.css`.
- There are NO React/Vue/Svelte dependencies. Components are all `.astro` (server-rendered). Client-side interactivity is vanilla TypeScript in `<script>` tags.
- Resume data is imported as JSON at build time (`import resumeData from '../data/resume.json'`), not fetched at runtime.
- The blog content collection uses Astro's legacy `type: 'content'` API. `post.id` includes the `.md` extension and must be stripped for clean URLs.
- The `Nav.astro` component fetches the blog collection at build time; the "Blog" link only appears when at least one post exists in `src/content/blog/`.
- Astro's built-in Shiki handles code syntax highlighting in blog posts.

## Owner Preferences

- **Aesthetic**: Dark, minimal, clean. Not crammed. Easy to read. Subtle animations only where they feel natural, not everywhere.
- **Maintenance**: The owner has limited JS/frontend experience. Content changes (resume, blog) should not require touching component code. JSON and Markdown are the primary content formats.
- **PDF Resume**: Must be downloadable. File served from `public/resume.pdf`, downloaded as `EmadGohari_MLE_CV_2026.pdf`.

## When Continuing Development

1. Read this file first for full context.
2. Check `src/data/resume.json` to see if the owner has updated their content.
3. Check `src/content/blog/` to see if any posts have been added.
4. Run `npm run dev` to start the local server at `http://localhost:4321`.
5. Run `npm run build` to verify everything compiles cleanly before finishing.
6. Keep changes minimal and consistent with the existing design language described above.
