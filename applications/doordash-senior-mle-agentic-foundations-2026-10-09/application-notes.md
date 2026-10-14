# Application notes: DoorDash, Senior MLE, New Verticals Agentic Foundations (internal)

- **Job:** Job ID 2728442, pasted into the conversation 2026-10-09. US locations (SF/Sunnyvale/Seattle/NYC). Emad is aware of the location issue and will handle it separately.
- **Settings:** alignment `optimize`, framing `confident`.
- **Positioning context recorded during tailoring:** "Ask DoorDash" conversational assistant, launched June 2026 for restaurant search and grocery cart-building from text, photos, and recipes ([TechCrunch](https://techcrunch.com/2026/06/11/doordashs-new-ai-chatbot-lets-you-order-with-prompts-and-photos/), [Grocery Dive](https://www.grocerydive.com/news/doordash-grocery-tools-conversational-shopping-assistant-agentic-ai/822735/)). Used for positioning only; not referenced in the resume.

## Final positioning
Theme: ships grounded, evaluated LLM and agent features, with judgment on quality, latency, and cost, on top of strong NLP and fine-tuning foundations.
- Business AI was moved to the top and expanded into four labelled highlights that map to the JD (context engineering, tool use and verification, eval-driven iteration, quality/latency/cost).
- Investigate is second (agents, tool descriptions, LLM-as-judge).
- Checkpoint is third (query understanding, latency budget).
- ER retraining and ER infrastructure are compressed.
- INAGO leads with T5 fine-tuning, the only open-weights fine-tuning evidence.
- The Publications section now lists the recommender and purchase-prediction papers second and third, for relevance to generative recommendation.

## Factual decisions
- Alignment and framing were chosen by Emad.
- **Fine-tuning:** nothing beyond T5 (2020). No SFT/LoRA, DPO, or RL work beyond that.
- **Model comparison (new, added to master as `kf-bai-model-comparison`):** in Business AI, Emad ran the summary sections on GPT-4 and Claude Sonnet and compared quality, latency, and cost to inform model selection. No winner, criteria detail, or numbers are recorded, so the resume states none.
- **Investigate:** stays as recorded (config layer, judge migration, contributor framing on the launch). No eval-run iteration, topology comparison, or guardrails claims.

## Claim → source map
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

## Omissions and gaps (intentional)
- Excluded: caching cost savings (retracted), agent-topology comparison (needs verification), the XGBoost model outcome and label-imbalance work (team context), annotation scale (unverified), RAG, Kubernetes, model serving, and Docker (scope unconfirmed). Billions of documents and 700 idents/sec were dropped for space.
- **JD gaps left visible:** preference optimization or RL; recent open-weights or SLM fine-tuning and deployment; an eval harness Emad owns, with measured agent-quality gains; grocery or retail domain; guardrails as an explicit component.
- **Interview prep:**
  - Be ready to explain the GPT-4 vs Sonnet comparison: method, criteria, and what was decided.
  - For the post-training gap, consider a small LoRA/DPO side project on an open SLM. It could only go on the resume once it is completed and labelled as a project.

## Final content decisions

- Revision role source: [Senior Machine Learning Engineer, New Verticals Agentic Foundations](https://careersatdoordash.com/jobs/senior-machine-learning-engineer-new-verticals-agentic-foundations/8279145/), retrieved 2026-10-13. The direct posting identified Job ID 3524079; the original pasted JD/listing identified 2728442. These are recorded source identities, not a new verification of current availability.
- Retain agent harness/configuration wording for the established PydanticAI layer: prompts, tool descriptions/availability, and agent/subagent wiring. Evaluation is migration of existing LLM-as-judge tooling for reuse and future CI/CD, not original judge design or completed integration.
- Emad selected evaluation skills F1 Score, ROC-AUC, MRR, MAP, and Recall@k, plus Clustering Models. These remain skill-level statements; no project-specific use, named clustering algorithms, or new outcomes are inferred. NDCG and silhouette score remain excluded.
- Confirmed INAGO knowledge-graph experimentation is supporting research detail. The conversational-QA project leads with NLP/LSTM text tagging and semi-automatically generated ontologies for question/intent interpretation. No specific NER architecture, graph database, GraphRAG, or production graph deployment is asserted. Main master evidence records `kf-cqa-knowledge-graphs` and `kf-cqa-lstm-tagging-ontology-intent`.
- Retain the established resume role/title and dates, all eight projects, GPAs, three paper entries plus the thesis, and the current skills wording. The default three-page format was accepted. The ATS limit is now two pages, achieved through layout only.
- Model comparison and clustering details were established during the preceding resume work; some extended evidence is recorded in the separate master-resume-updates worktree. This consolidation preserves the approved application wording and promotes the related INAGO corrections currently in this checkout.

## Final rendering and validation

- Default: [EmadGohari_CV_2610v4.pdf](EmadGohari_CV_2610v4.pdf), 3 Letter pages, original DoorDash sans-serif/serif design, 103% auto-fit.
- ATS: [EmadGohari_CV_sp_2610v5.pdf](EmadGohari_CV_sp_2610v5.pdf), 2 Letter pages, `--ats --compact`, 100%. No content cuts. Filenames reflect retained artifacts after local renumbering.
- [Shared layout settings](../../docs/resume-layouts.md) are authoritative for typography, spacing, contact/header structure, filename conventions, and reproduction. Default and regular ATS remain independent of the compact profile.
- Final JSON/Markdown preserved during consolidation. All 167 nonempty source strings were verified with two PDF text extractors, along with section order, all four contact links, embedded Unicode font maps, and complete visual review. The default preserves bold descriptions; ATS removes inline emphasis while retaining title/label weights.
- Public resume JSON/PDFs remain unchanged. These application PDFs contain no internal notes or unresolved claim questions. Nothing submitted to the employer.
