# DoorDash — Senior MLE, New Verticals Agentic Foundations (internal notes)

[Application](#application) · [Sources](#sources-and-evidence) · [Positioning](#positioning-and-selection) · [Decisions](#decisions) · [Gaps](#gaps-and-follow-ups) · [Outputs](#outputs-and-rendering) · [Validation](#validation)

## Application

- Role: Senior Machine Learning Engineer, New Verticals Agentic Foundations. Original pasted JD/listing: Job ID 2728442 (2026-10-09). Revision posting: Job ID 3524079 (retrieved 2026-10-13).
- Location: US roles (SF/Sunnyvale/Seattle/NYC); Emad is aware and will handle eligibility/location separately.
- Alignment / framing: `optimize` / `confident`, selected by Emad.
- Constraints: preserve full content; default three-page format accepted, ATS maximum two pages.
- Updated: 2026-10-14. Status: final PDFs validated; not submitted to the employer.

## Sources and evidence

- Revision JD: [official role posting](https://careersatdoordash.com/jobs/senior-machine-learning-engineer-new-verticals-agentic-foundations/8279145/), retrieved 2026-10-13. Original job text was supplied in the conversation on 2026-10-09. The two job IDs above are recorded source identities, not a new check of availability.
- Editable source: [resume.json](resume.json). Evidence: repository master plus the separate `master-resume-updates` worktree and Emad's clarifications. Model-comparison/clustering detail is recorded in that extended evidence; main master includes the confirmed INAGO graph/LSTM/ontology corrections.
- Positioning context recorded during tailoring: Ask DoorDash conversational restaurant/grocery assistant ([TechCrunch](https://techcrunch.com/2026/06/11/doordashs-new-ai-chatbot-lets-you-order-with-prompts-and-photos/), [Grocery Dive](https://www.grocerydive.com/news/doordash-grocery-tools-conversational-shopping-assistant-agentic-ai/822735/)). Employer context only; not a claim about Emad's experience or text in the resume.

| Resume claim | Source |
|---|---|
| Production, hundreds of reports/day | kf-bai-production (metric verified) |
| Selective XML → targeted per-section calls; avoids long-context degradation | kf-bai-selective-xml |
| Bing + LLM verification; claims linked to sources | kf-bai-name-verification |
| SME rounds against PM exemplars for 10–15 companies | kf-bai-sme-iteration |
| GPT-4 vs Claude Sonnet quality/latency/cost comparison | kf-bai-model-comparison (Emad, 2026-10-09) |
| Contributed to commercially launched CLEAR Investigate | kf-inv-product-launch |
| Central config layer for prompts, tools, and agent/subagent wiring | kf-inv-central-config |
| LLM-as-judge migration, prepared for CI/CD | kf-inv-llm-judge-migration |
| Query-intent classifier; 95%; ~100ms | kf-cp-intent-classifier, kf-cp-access-improvement, kf-cp-latency-sme |
| Retraining pipeline; MLflow; estimated ~40%; Snowflake PoC | kf-er-sagemaker-retraining, kf-er-parallel-experiments, kf-er-snowflake-poc |
| ~800M entities (system context); PII environment; schema; pipelines | kf-infra-system-scale, kf-infra-* |
| T5 fine-tune; 40% curation effort | kf-qg-t5 |
| Title "Senior Machine Learning Engineer II (Research)", Jul 2021 – Present | claim_checks, Title and dates |

Additional evidence: `kf-cqa-knowledge-graphs` and `kf-cqa-lstm-tagging-ontology-intent` support the INAGO research framing. Metric choices/clustering skills were clarified by Emad on 2026-10-13; they do not establish project-specific metric implementation.

## Positioning and selection

- Theme: grounded, evaluated LLM/agent delivery with quality, latency, and cost judgment, supported by NLP and fine-tuning foundations.
- Section order: Summary, Technical Skills, Experience with projects nested under each employer, Education, Publications.
- TR projects: Business AI first with four highlights (context engineering, tools/verification, SME iteration, model comparisons); Investigate second; Checkpoint third; retraining and infrastructure afterward in shorter form.
- INAGO: T5 fine-tuning, conversational QA with NLP/LSTM models, then domain-specific NLU. Retain all eight projects, GPAs, three papers plus thesis. Recommender and purchase-prediction papers are second/third for relevance to generative recommendation.

## Decisions

| ID | Topic | Final decision | Basis |
| --- | --- | --- | --- |
| F1 | Title and dates | Retain Senior Machine Learning Engineer II (Research), Jul 2021 - Present, and established employment chronology. | Previously resolved user choices; master claim checks. |
| F2 | Fine-tuning | T5 (2020) is the supported open-weights fine-tuning experience; no SFT/LoRA, DPO, or RL claims. | Existing project evidence and Emad's clarification. |
| F3 | Model comparison | GPT-4/Claude Sonnet comparison on quality, latency, and cost; no winner or unrecorded criteria/numbers. | Emad, 2026-10-09; `kf-bai-model-comparison`. |
| F4 | Agent contribution | PydanticAI configuration of prompts/tools/agent wiring and migration of existing judge tooling for reuse/future CI/CD. Contributor to the commercial launch; no complete runtime ownership, original judge design, completed CI/CD, topology comparison, guardrails, tracing, or measured agent-quality gain. | `kf-inv-central-config`, `kf-inv-llm-judge-migration`, launch evidence. |
| F5 | Evaluation/clustering skills | F1 Score, ROC-AUC, MRR, MAP, Recall@k and Clustering Models at skill level; no new project-specific metric use or named clustering algorithms. | Emad's selections, 2026-10-13. |
| F6 | Conversational QA | Lead with NLP/LSTM text tagging and semi-automatic ontologies for question/intent interpretation; knowledge graphs remain supporting research. No NER-specific architecture, graph database, GraphRAG, or production graph scope. | Emad, 2026-10-13; confirmed INAGO fact IDs. |
| C1 | Coverage | Keep full project highlights, skills wording, degrees/GPAs, three paper entries and thesis. | Accepted expanded DoorDash content. |
| L1 | Default | Original sans-serif/serif design, 3 pages at 103% auto-fit. | Emad's default-style restoration and accepted length. |
| L2 | ATS | Two pages via `--ats --compact`, 100%; no text cuts. Keep contact grid, subtitle/location separator, stacked job metadata and inline project metadata. | Emad's ATS decisions and two-page request; shared settings. |

## Gaps and follow-ups

- Deliberate omissions: retracted caching savings; unverified annotation volume; team-owned XGBoost outcomes/label-imbalance work; unestablished RAG, Kubernetes, model-serving and Docker scope. Billions of documents and 700 idents/sec omitted for space. NDCG and silhouette score excluded by user choice.
- JD gaps: preference optimization/RL, recent open-model/SLM fine-tuning/deployment, an owned evaluation harness with measured agent gains, grocery/retail domain, and guardrails as an explicit component. Agent-topology comparison remains unverified.
- Unresolved questions affecting final content: None; unsupported extensions remain excluded. Prepare location/eligibility separately.
- Interview preparation: model-comparison method/criteria/decision; personal versus team scope; basis for search access improvement, T5 curation saving, and estimated retraining saving. A proposed LoRA/DPO side project is future work and may only enter a resume after completion, accurately labelled.

## Outputs and rendering

- Editable source: [resume.json](resume.json). Markdown is not required for future outputs; the existing copy is a legacy artifact.

| PDF | Layout/profile | Pages / scale |
| --- | --- | --- |
| [EmadGohari_CV_2610v4.pdf](EmadGohari_CV_2610v4.pdf) | Default | 3 / 103% |
| [EmadGohari_CV_sp_2610v5.pdf](EmadGohari_CV_sp_2610v5.pdf) | `--ats --compact` | 2 / 100% |

[Shared layout settings and reproduction](../../docs/resume-layouts.md) define typography, spacing, metadata/contact structure, and filename conventions. Names reflect retained files after local renumbering. Default/regular ATS remain independent of compact ATS.

## Validation

- Content: schema passed; both PDF text extractors preserved all 167 nonempty source strings, section order, and all four contact links. No content cuts during ATS compression.
- Layout: every final page visually reviewed; embedded Unicode font maps and selectable/searchable text verified. Fresh exports matched retained PDFs pixel-for-pixel across all five pages during PR consolidation.
- Preservation/status: JSON/PDFs remain unchanged by this notes restructure. Public resume JSON/PDFs unchanged. Internal notes/unresolved claim prompts are absent from submission PDFs. Nothing submitted to DoorDash.
