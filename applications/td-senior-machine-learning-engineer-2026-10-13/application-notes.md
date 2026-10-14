# TD / Layer 6 - Senior Machine Learning Engineer (internal notes)

- Requisition: R_1478728, Toronto. Settings: alignment `lean`, framing `confident`, explicitly selected by Emad on 2026-10-13.
- [Supplied posting](https://td.wd3.myworkdayjobs.com/TD_Bank_Careers/job/Toronto-Ontario/Senior-Machine-Learning-Engineer_R_1478728?jr_id=6a7b26ab77e6b569c61beb22).
- Retrieved 2026-10-13 from the [official Workday CXS endpoint](https://td.wd3.myworkdayjobs.com/wday/cxs/td/TD_Bank_Careers/job/Toronto-Ontario/Senior-Machine-Learning-Engineer_R_1478728), because the browser research tool could not read the posting page. Full response retained in `job-posting.json`; requisition identity checked. `canApply: true`, `posted: true`, `remoteType: Onsite` at retrieval.
- Employer context comes from the posting: Layer 6 is TD's AI centre of excellence, working across ML/GenAI, large financial/document/conversation datasets, and academic collaboration. This is target context, not evidence of Emad's banking experience.

## Evidence and final positioning

Editable starting point: `applications/doordash-senior-mle-agentic-foundations-2026-10-09/resume.json`, including the current manual edits and decisions in its `application-notes.md`. Evidence: the actual working-tree files `src/data/master-resume.json` and `/home/emad/repos/job_landing/emadg.github.io-master-resume-updates/src/data/master-resume.json`. The latter includes supported facts missing in the main checkout, notably model comparison and the clustering clarification. No file or branch literally named `master-resume-changes` was found; the separate `master-resume-updates` worktree is the relevant source.

Positioning: ML systems engineer with production NLP/GenAI delivery, reusable model-training workflows, sensitive-data infrastructure, and deep-learning research. Preserve broad ML identity with TD emphasis, rather than retaining DoorDash's agent-first summary.

Order: Summary, Technical Skills, Experience with projects nested under each employer, Education, Publications. Lead TR with retraining followed by production summarization, then infrastructure, agents/evaluation, and semantic search. Keep T5 and conversational QA as INAGO projects; retain Word2Vec/LSTM NLU and interpretability in the job description to avoid a duplicative third research entry. Aim for two Letter pages in the existing default layout; deliver JSON, Markdown, PDF, and these internal notes under this new application directory. Validate schema, final claims, complete PDF text, links, page layout, and preservation of source files.

## Decisions

- Emad selected lean/confident. For the LangGraph question he answered, "yeah emphasize existing experienced tools I have": emphasize PyTorch/PydanticAI; omit LangGraph.
- GPU question received "ok", which supplies no factual account of GPU training. Omit GPU claims. This is a missing-evidence item, not a statement that Emad has never used GPUs.
- Carry forward the previously resolved resume title and dates: `Senior Machine Learning Engineer II (Research)`, `Jul 2021 - Present`. The master says the official HR title is believed to be Senior Research Engineer II; these artifacts preserve Emad's established resume format. An application field requiring the exact HR title needs that record.
- Preserve project stages: internal retraining/infrastructure, commercially launched product contributor framing for Investigate, customer-facing production for Business AI and Checkpoint, research for INAGO. Snowflake remains explicitly proof of concept within the retraining entry.
- Estimated ~40% experiment turnaround reduction remains an estimate of researcher time per round, with no formal baseline. Other selected metrics were previously confirmed by Emad; methods remain undocumented for interview preparation.
- Omit optional GPAs for space. Keep all three peer-reviewed publication entries in the existing short-citation format; retain the thesis under Education rather than duplicating it in Publications. Full author order and bibliographic metadata are not asserted.

## Requirement and claim map

| TD requirement | Personal action / source | Supported result / boundary |
| --- | --- | --- |
| Scalable ML integrated with data infrastructure | `kf-er-sagemaker-retraining`, `kf-er-reusable-components`: designed, implemented, tested SageMaker DAG; extended reusable Python/PySpark processing components | Researchers' feature-generation, training, and metric code becomes reusable steps. Internal workflow; no model-serving claim. |
| Automation and operational efficiency | `kf-er-parallel-experiments`: parallel training and MLflow tracking | Estimated ~40% less researcher time per round; no measured service throughput claim. |
| Data-platform integration | `kf-er-snowflake-poc`: processing/training PoCs and migration-gap assessment | Feasibility work, not a deployed Snowflake platform. |
| Large-scale data-intensive software | `kf-infra-system-scale`, `kf-infra-annotation-schema`: infrastructure for entity-resolution system; versioned schema and Spark/Python normalization, merging, conflict surfacing | ~800M entities/billions of documents are system context, not volume personally processed or throughput of Emad's pipeline. Annotation scale omitted. |
| Repeatable data workflows | `kf-infra-pipeline-automation`: automated manual runs using SageMaker Pipelines | Scheduled, repeatable internal runs; no invented error/time metric. |
| Sensitive-data context / transferable banking relevance | `kf-infra-pii-environment`: PII-isolated SageMaker/CloudFormation environment and researcher profiles | Direct KYC/AML-supporting platform context. Banking transaction modelling and bank-specific regulatory compliance remain unestablished. |
| Production GenAI and Python | `kf-bai-production`, `kf-bai-selective-xml`: summarization workflow, selective XML, targeted calls | Customer-facing production, hundreds of reports daily. Not RAG or a chatbot. |
| Quality and delivery tradeoffs | `kf-bai-name-verification`, `kf-bai-sme-iteration`, `kf-bai-model-comparison`: search/verification/citation linking, feedback iteration, GPT-4/Claude comparison | Grounded output and informed model selection; no quantitative quality/cost gains or model winner. |
| Maintainable software design | `kf-inv-central-config`, `kf-inv-llm-judge-migration`: centralized prompts/tools/agent wiring; migrated existing judge tooling | Reconfiguration from one place and reuse. No claim of whole-agent architecture ownership, original judge design, or completed CI/CD integration. |
| Production ML and latency awareness | `kf-cp-intent-classifier`, `kf-cp-access-improvement`, `kf-cp-latency-sme`: shipped query-intent classifier and used SME/customer feedback | 95% improvement in access to conceptual documents within ~100ms request-path budget, as previously confirmed. Not 95% model accuracy. |
| Deep learning, PyTorch, model training | `kf-qg-t5`, `kf-nlu-lstm`: T5 fine-tuning/BLEURT; Word2Vec/LSTM NLU and interpretability testing | 40% less manual curation for T5, previously confirmed; research stages. GPU environment remains unrecorded. |
| Conversation/document experience | `kf-cqa-system`, `kf-cqa-lstm-tagging-ontology-intent`, `kf-cqa-knowledge-graphs`: document analysis, tagging, ontology-based question/intent interpretation, graph research | Transferable QA/document experience; no bank-conversation dataset, graph database, or production QA claim. |
| Research and degree | Master education/publications, existing resume | M.Sc. CS and three publication entries. Thesis retained in education. |
| Coding proficiency / libraries | Master skills inventory and recorded project stacks | Python and Java plus established Scala/Bash, pandas/NumPy/spaCy. PyTorch directly meets a named preferred library. |
| Broader training/evaluation skills | Master `Evaluation metric skills and exclusions`, `kf-cp-clustering` | F1, ROC-AUC, MRR, MAP, Recall@k and Clustering Models retained as established skills; no fabricated project-specific metric use or algorithm names. |

## Omissions and interview limits

- Exclude retracted caching savings, unverified annotation volume, personal XGBoost model-design/evaluation ownership, Kubernetes, direct RAG, Docker scope, model-hosting APIs/observability ownership, LangGraph, GPU training, bank transaction modelling, time-series expertise, and graph-database claims.
- No people-management, compliance certification, whole-platform ownership, completed CI/CD integration, or measured agent-quality gain is inferred.
- Do not use NDCG or silhouette score. System throughput target (700 idents/sec) omitted for space and to avoid confusing it with personal implementation performance.
- Prepare the basis for 95% search access improvement, T5 40% curation reduction, hundreds of reports/day, and the estimated retraining saving. Prepare architecture tradeoffs, model comparison method, and exact personal integration scope for interviews.

## Final rendering and validation

- Default: [EmadGohari_CV_2610v6.pdf](EmadGohari_CV_2610v6.pdf), 2 Letter pages, original DoorDash sans-serif/serif design, 100% auto-fit.
- ATS: [EmadGohari_CV_sp_2610v6.pdf](EmadGohari_CV_sp_2610v6.pdf), 2 Letter pages, regular `--ats`, 100%. No ATS text cuts. Filenames reflect retained artifacts after local renumbering.
- [Shared layout settings](../../docs/resume-layouts.md) are authoritative. ATS keeps the subtitle below the name, a spaced em dash/full location on that line, two-column contacts, stacked job dates/full locations, inline project dates/stages, larger headings, and no heading prefixes. No Proxima Nova/Source Sans font dependency remains.
- Retained two INAGO projects, with Word2Vec/LSTM NLU detail in the role description, both degrees, three paper entries, and thesis in Education only. GPAs are omitted. Content remains the final lean/confident TD variant rather than DoorDash's expanded agent-focused version.
- JSON/Markdown unchanged during layout/consolidation work. All 140 nonempty source strings were verified with two PDF text extractors, along with reading order, full metadata, four contact links, embedded Unicode fonts, and complete visual review.
- Public resume JSON/PDFs remain unchanged. No internal notes or unresolved questions appear in submission files. Nothing submitted to TD.
