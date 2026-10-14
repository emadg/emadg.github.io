# TD / Layer 6 — Senior Machine Learning Engineer (internal notes)

[Application](#application) · [Sources](#sources-and-evidence) · [Positioning](#positioning-and-selection) · [Decisions](#decisions) · [Gaps](#gaps-and-follow-ups) · [Outputs](#outputs-and-rendering) · [Validation](#validation)

## Application

- Role/requisition/location: Senior Machine Learning Engineer, R_1478728, Toronto.
- Alignment / framing: `lean` / `confident`, selected by Emad on 2026-10-13.
- Constraints: two Letter pages in default and ATS; preserve supported ML breadth and established tool experience.
- Updated: 2026-10-14. Status: final PDFs validated; not submitted to TD.

## Sources and evidence

- JD: [supplied posting](https://td.wd3.myworkdayjobs.com/TD_Bank_Careers/job/Toronto-Ontario/Senior-Machine-Learning-Engineer_R_1478728?jr_id=6a7b26ab77e6b569c61beb22), retrieved 2026-10-13 via the [official Workday CXS endpoint](https://td.wd3.myworkdayjobs.com/wday/cxs/td/TD_Bank_Careers/job/Toronto-Ontario/Senior-Machine-Learning-Engineer_R_1478728) because the browser research tool could not read the posting. Full response: [job-posting.json](job-posting.json). At retrieval: `canApply: true`, `posted: true`, `remoteType: Onsite`.
- Base: current DoorDash application JSON/manual edits. Evidence: repository master and the separate `master-resume-updates` worktree, which contains additional supported model-comparison/clustering detail. The requested `master-resume-changes` base was identified as that worktree. Editable TD source: [resume.json](resume.json).
- Employer context: Layer 6 is TD's AI centre of excellence, with ML/GenAI, financial/document/conversation datasets, and academic collaboration. This is posting context, not proof of banking experience.

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

## Positioning and selection

- Theme: ML systems engineering, production NLP/GenAI, reusable training workflows, sensitive-data infrastructure, and deep-learning research; retain broader ML identity with TD emphasis.
- Section order: Summary, Technical Skills, Experience with employer projects, Education, Publications.
- TR order: retraining, production summarization, infrastructure, agent configuration/evaluation, semantic search. INAGO: T5 and conversational QA; Word2Vec/LSTM NLU and interpretability remain in the role description.
- Keep both degrees and three paper entries. Thesis appears in Education only; GPAs omitted. Skills emphasize established PyTorch/PydanticAI rather than unsupported JD keywords.

## Decisions

| ID | Topic | Final decision | Basis |
| --- | --- | --- | --- |
| F1 | Title/dates | Preserve Senior Machine Learning Engineer II (Research), Jul 2021 - Present. Exact HR title remains believed to be Senior Research Engineer II; an application field requiring it needs the HR record. | Previously resolved resume format; master title/date checks. |
| F2 | LangGraph | Omit LangGraph and emphasize existing experienced tools, including PyTorch/PydanticAI. | Emad: “yeah emphasize existing experienced tools I have”, 2026-10-13. |
| F3 | GPU experience | Omit GPU training claims. The answer “ok” supplied no factual account; it does not establish lack of experience either. | Unresolved factual evidence, 2026-10-13. |
| F4 | Project stages | Retraining/infrastructure internal; Business AI/Checkpoint production; Investigate commercial launch contributor; INAGO research. Snowflake stays proof of concept. | Master/project sources and existing confirmed stages. |
| F5 | Retraining metric | Estimated ~40% researcher-time saving per round, without a formal baseline; no new throughput or model-quality outcome. | Previously established estimate and scope. |
| F6 | Scale and metrics | ~800M entities/billions of documents are system context; retain established search 95%, ~100ms and T5 40% with original meaning. Evaluation/clustering names remain skills, not fabricated project metrics. | Source map and user-confirmed results/skills. |
| C1 | Research/education coverage | Two INAGO projects, NLU detail in role description, no GPAs; thesis in Education and three publication entries. No full author order/bibliographic metadata inferred. | Space/relevance selection for TD. |
| C2 | Positioning | Lean toward ML pipelines, infrastructure and production NLP/GenAI while retaining ML/research breadth. | Emad's lean/confident settings. |
| L1 | Default | Original DoorDash sans-serif/serif design, 2 pages at 100%. | Emad's default restoration; final render. |
| L2 | ATS | Regular `--ats`, 2 pages at 100%, without content cuts. Subtitle below name with spaced em dash/full location, two-column contacts, stacked job metadata, inline project metadata, no heading prefixes. | Emad's final ATS preferences; shared settings. |

## Gaps and follow-ups

- Deliberate omissions: retracted caching savings, unverified annotation volume, personal XGBoost model-design/evaluation ownership, Kubernetes, direct RAG, Docker/model-serving/observability scope, LangGraph, GPU training, banking transaction modelling, time-series expertise, and graph-database claims. No people-management, compliance certification, whole-platform ownership, completed CI/CD, or measured agent-quality gain inferred.
- NDCG and silhouette score excluded by user choice. The 700 idents/sec system target is omitted to avoid presenting it as personal implementation performance.
- Unresolved questions: GPU experience is unrecorded and omitted; exact HR title requires a record if requested in an application field. Neither blocks the current confirmed resume format. No other content-blocking questions.
- Interview preparation: basis/method for search 95%, T5 40%, hundreds of reports/day and estimated retraining saving; architecture tradeoffs, model-comparison method, and personal integration scope.

## Outputs and rendering

- Editable source: [resume.json](resume.json). Markdown is not required for future outputs; the existing copy is a legacy artifact.

| PDF | Layout/profile | Pages / scale |
| --- | --- | --- |
| [EmadGohari_CV_2610v6.pdf](EmadGohari_CV_2610v6.pdf) | Default | 2 / 100% |
| [EmadGohari_CV_sp_2610v6.pdf](EmadGohari_CV_sp_2610v6.pdf) | Regular `--ats` | 2 / 100% |

[Shared layout settings and reproduction](../../docs/resume-layouts.md) are authoritative; no custom-font dependency remains. Filenames reflect retained files after local renumbering.

## Validation

- Content: schema passed; both PDF text extractors preserved all 140 nonempty source strings, reading order, full metadata, and all four contact links. No ATS text cuts.
- Layout: every final page visually reviewed; embedded Unicode fonts and searchable/selectable text verified. Fresh exports matched retained PDFs pixel-for-pixel across all four pages during PR consolidation.
- Preservation/status: JSON/PDFs remain unchanged by this notes restructure. Public resume JSON/PDFs unchanged. No internal notes/unresolved questions in submission files. Nothing submitted to TD.
