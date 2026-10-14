# Resume PDF layouts

The default layout retains the original DoorDash design. ATS uses the same sans-serif font with a simpler layout; the compact ATS profile fits the longer DoorDash content into two pages without text cuts. Each layout is independent, so changing ATS does not restyle the default.

## Typography

Sizes below are in points at 100% scale. Regular text uses weight 400; names, headings, titles, and labels use weight 700. There is no light-weight font or custom-font dependency.

| Element | Default | ATS | Compact ATS |
| --- | --- | --- | --- |
| Name, bold | 24 | 22 | 22 |
| Subtitle, regular | 11.5 | 10 | 10 |
| Section headings, bold | 13, serif | 15, sans-serif | 15, sans-serif |
| Job and degree titles, bold | 11.5 | 11.5 | 11.5 |
| Work Projects, bold | 11 | 11.5 | 11.5 |
| Project titles, bold | 10.5 | 11 | 11 |
| Publication titles, bold | 10.5 | 11 | 10 |
| Body text and bullets, regular | 10 | 11 | 10 |
| Contact details | 9 | 9.5 | 9.5 |
| Job/education dates and locations | 9 | 10 | 10 |
| Project dates and stages | 9 | 9.25 | 9.25 |
| Tech & Skills | 9 | 10 | 9.5 |
| Education notes and publication metadata | 9 | 10 | 9.5 |
| Body line spacing | 1.35 | 1.2 | 1.12 |

All layouts use `Arial, 'Liberation Sans', sans-serif`. Default section headings use `Georgia, 'Liberation Serif', serif`. The checked PDFs embed Liberation Sans regular/bold and, for default headings, Liberation Serif bold. Text stays selectable and searchable.

## Structure and spacing

All exports use Letter paper with 0.45-inch top/bottom and 0.5-inch side margins. Default auto-fit can scale typography and spacing together from 94% to 103%; ATS stays at 100% unless `--zoom` is explicitly supplied.

Default retains contact icons, divider lines, serif section headings, inline emphasis, indented projects, stage labels in brackets, right-aligned dates, and separate location lines. Work Projects headings are uppercase.

ATS has no `>` heading prefixes or decorative rules. The subtitle is below the name, followed by an em dash with 6 pt extra spacing on each side and the full location. Contact Info has two equal columns and two rows: email/GitHub, then LinkedIn/website. Location is not repeated in that block. Source order follows the rows; the resume body remains a single column.

ATS job titles have dates and full locations on separate lines, retaining Canada. Project dates and deployment stages remain inline after an em dash in smaller regular type. Descriptions have no inline bold emphasis; titles and field labels remain bold. Compact ATS retains this structure and the heading hierarchy.

| Gap or margin, pt | Default | ATS | Compact ATS |
| --- | --- | --- | --- |
| After header | 12, plus 8 bottom padding | 9 | 6 |
| After section/job | 12 | 9 | 6 |
| After section heading | 6, plus 3 bottom padding | 4 | 3 |
| After skill row | 2 | 2 | 1 |
| After job header | 6 | 4 | 3 |
| Before Work Projects | 7 | 5 | 4 |
| After project | 8 | 6 | 4 |
| Before project description/Tech & Skills | 3 | 2 | 2 |
| After education entry | 8 | 6 | 4 |
| After publication | 7 | 5 | 3 |

Styles live in [resume-default.css](../src/styles/resume-default.css) and [resume-ats.css](../src/styles/resume-ats.css); [resume.astro](../src/pages/resume.astro) selects the stylesheet and ATS-only markup. The [PDF renderer](../scripts/generate-pdf.mjs) selects layout and density explicitly, ignoring inherited layout/density variables. `--compact` requires `--ats`.

## Final TD and DoorDash results

The existing filenames below were retained after local cleanup/renumbering. They identify the final artifacts rather than earlier rendering experiments. The matching JSON/Markdown content was preserved during layout changes.

| Application | Settings and positioning | Default result | ATS result |
| --- | --- | --- | --- |
| [TD / Layer 6](../applications/td-senior-machine-learning-engineer-2026-10-13/resume.json) | Lean alignment, confident framing; ML pipelines, sensitive-data infrastructure, production NLP/GenAI and research | [v6 PDF](../applications/td-senior-machine-learning-engineer-2026-10-13/EmadGohari_CV_2610v6.pdf), 2 pages, 100% | [v6 PDF](../applications/td-senior-machine-learning-engineer-2026-10-13/EmadGohari_CV_sp_2610v6.pdf), regular ATS, 2 pages, 100% |
| [DoorDash / Agentic Foundations](../applications/doordash-senior-mle-agentic-foundations-2026-10-09/resume.json) | Optimize alignment, confident framing; grounded LLM/agent features, configuration/evaluation, quality/latency/cost tradeoffs | [v4 PDF](../applications/doordash-senior-mle-agentic-foundations-2026-10-09/EmadGohari_CV_2610v4.pdf), 3 pages, 103% | [v5 PDF](../applications/doordash-senior-mle-agentic-foundations-2026-10-09/EmadGohari_CV_sp_2610v5.pdf), compact ATS, 2 pages, 100% |

DoorDash preserves its fuller project highlights, three INAGO projects, GPAs, and thesis publication. TD uses shorter descriptions, two INAGO projects with NLU detail in the role description, no GPAs, and the thesis only in Education. Neither ATS rendering removes content relative to its application JSON.

The related master-source corrections record confirmed INAGO knowledge-graph experimentation, LSTM text tagging, and semi-automatic ontology generation for question/intent interpretation. They retain research scope and uncertainty around exact graph technology, tagging labels, and measured outcomes. Application notes preserve the claim/source maps and omissions.

The public portfolio's resume JSON and downloadable PDFs are unchanged by these application exports. These files do not submit an application. ATS parsing still varies between systems.

## Reproduce and verify

From the repository root, replace `<dir>` with the application directory and `<YYMM>v<N>` with the next version. Use `--ats` for TD ATS and `--ats --compact` for DoorDash ATS:

```bash
npm run pdf -- --data applications/<dir>/resume.json --out applications/<dir>/EmadGohari_CV_<YYMM>v<N>.pdf
npm run pdf -- --ats --data applications/<dir>/resume.json --out applications/<dir>/EmadGohari_CV_sp_<YYMM>v<N>.pdf
npm run pdf -- --ats --compact --data applications/<dir>/resume.json --out applications/<dir>/EmadGohari_CV_sp_<YYMM>v<N>.pdf
```

Chrome/Chromium must be installed; set `CHROME_PATH` if needed. The renderer starts an isolated dev server (default port 4399) and refuses a busy port. Use `--port` for simultaneous verification exports. Preview with `RESUME_LAYOUT=ats npm run dev`, adding `RESUME_DENSITY=compact` for compact ATS.

New PDFs use `EmadGohari_CV_<YYMM>v<N>.pdf` and `EmadGohari_CV_sp_<YYMM>v<N>.pdf`. Choose the next version across application directories for that month; paired exports of a new revision share the version. Preserve existing files.

For a two-page ATS target, adjust spacing/profile first. Propose specific text cuts for Emad's agreement before shortening or removing content; do not force a fit with unreadable typography. Validate JSON, page count, every rendered page, full extracted text/reading order, embedded fonts, and links. The compact profile is not a page-count guarantee for different content.

Consolidation validation: the Astro build and master/application JSON schemas passed. Fresh exports match all four retained PDFs pixel-for-pixel across all nine pages. Two text extractors preserve all 140 TD and 167 DoorDash source strings in each layout, with correct section order, embedded Unicode fonts, and all four contact links.
