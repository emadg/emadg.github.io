# Emad Gohari

**Senior Machine Learning Engineer · LLM Agents, Evaluation, NLP**
Toronto, ON, Canada · E.Gohari.B@gmail.com · github.com/emadg · linkedin.com/in/emad-gohari · EmadGohari.com

## Summary

Senior machine learning engineer with **8 years of experience** taking NLP and LLM systems from research to production. At Thomson Reuters Labs, built a **production LLM summarization workflow processing hundreds of reports daily**, combining targeted context extraction, source verification and citations, SME-driven evaluation, and **GPT-4/Claude Sonnet comparisons on quality, latency, and cost**. Contributed **agent configuration and reusable LLM-as-judge evaluation tooling** to **CLEAR Investigate**, a commercially launched agentic AI investigation product.

## Technical Skills

- **LLMs & Agents:** LLM Agents & Tool Use, Agent Harness Engineering, Agentic Frameworks (PydanticAI), Multi-Agent Orchestration, Prompt & Context Engineering, LLM Evaluation (LLM-as-Judge, SME Review), Grounding & Source Citation, Model Selection (Quality, Latency, Cost), GPT-4, Claude, OpenAI API
- **Machine Learning & NLP:** NLP, Machine Learning, Deep Learning, PyTorch, Hugging Face Transformers, Transformer Fine-Tuning (T5), Sentence Embeddings, Semantic Search, Text Classification & Text Tagging, Clustering Models, Knowledge Extraction & Representation (Knowledge Graphs, Ontologies), Model Training & Evaluation (F1 Score, ROC-AUC, MRR, MAP, Recall@k), XGBoost, scikit-learn, spaCy, pandas, NumPy
- **MLOps, Data & Cloud:** ML Pipelines, Experiment Tracking (MLflow), AWS SageMaker (Studio, Pipelines), Apache Spark (PySpark), Snowflake, AWS (S3, EMR, CloudFormation), PostgreSQL
- **Languages:** Python, Java, Scala, Bash

## Experience

### Senior Machine Learning Engineer II (Research), Thomson Reuters

Toronto, Canada · Jul 2021 - Present

Built LLM features, agent workflows, search models, and training pipelines at TR Labs for CLEAR, Thomson Reuters' due-diligence and investigation platform, and Checkpoint, its tax research platform. Worked with researchers, subject-matter experts, and product engineering.

**CLEAR Business AI: GenAI Report Summarization** · Production · 2024

Built the LLM summarization workflow for CLEAR Business entity reports, **live in production processing hundreds of reports daily**.

- **Context engineering:** designed selective XML extraction to feed each targeted LLM call only the relevant report fields and sections, covering business overview, key personnel, adverse media, liens, and lawsuits. Kept context focused to limit long-context degradation without truncating reports.
- **Tool use and verification:** integrated Bing Search with an LLM verification step to **reduce false matches between same-named people and businesses**. Linked summary claims to their source locations in the report.
- **Evaluation-driven iteration:** refined extraction logic and system prompts across SME annotation rounds, using product-manager exemplar summaries for 10-15 companies. Translated section-level feedback into extraction and prompt changes, including examples for facts embedded in free text.
- **Quality, latency, and cost:** compared summary outputs from **GPT-4 and Claude Sonnet** on quality, latency, and cost to inform model selection.

*Tech & Skills:* Python, GPT-4, Claude Sonnet, Bing Search API, Context Engineering, LLM Evals, XML Processing

**Agentic Investigation System: CLEAR Investigate** · Production · 2025 - 2026

Contributed to **CLEAR Investigate, Thomson Reuters' commercially launched agentic AI product** for investigations.

- **Agent configuration:** built a central PydanticAI layer for system prompts, tool descriptions and availability, and agent/subagent wiring, enabling experimenters to **reconfigure investigation agents from one place** instead of editing scattered definitions.
- **Evaluation tooling:** migrated the team's existing **LLM-as-judge evaluation** capability into an organized repository for reuse and future CI/CD integration.

*Tech & Skills:* Python, PydanticAI, Claude, Agent Harness Engineering, Multi-Agent Orchestration, LLM Evaluation Tooling

**Semantic Search Query Understanding: Checkpoint Tax Research** · Production · 2021

Shipped a **sentence-embedding query-intent classifier** that distinguished broad conceptual queries from specific tax lookups and promoted higher-level documents for non-specialist users, **improving access to conceptual documents by 95%** within a **~100ms latency budget**. Identified the retrieval gap through SME and customer feedback.

*Tech & Skills:* Python, Sentence Embeddings, Text Classification, Semantic Search

**Model Retraining & Experimentation Pipelines: CLEAR Entity Resolution** · Internal tool · 2026

Designed and built an **on-demand model-retraining pipeline** on SageMaker Pipelines, turning researchers' feature-generation, training, and evaluation code into reusable DAG steps. Enabled **parallel experiments tracked in MLflow**, cutting experiment turnaround by an **estimated ~40%**. Also built proof-of-concept Snowflake processing and training pipelines.

*Tech & Skills:* Python, AWS SageMaker Pipelines, MLflow, PySpark, Snowflake, XGBoost

**Entity Resolution Data Infrastructure: CLEAR KYC/AML** · Internal tool · 2022 - 2024

Built research data infrastructure for an entity-resolution system spanning **~800M entities**. Designed a **PII-isolated AWS research environment** using SageMaker Studio and CloudFormation; defined a **versioned schema reconciling two incompatible annotation sources**, with Spark pipelines to merge records and surface conflicts; and replaced manual runs with **scheduled, repeatable SageMaker Pipelines**.

*Tech & Skills:* Python, Apache Spark (PySpark), AWS SageMaker, AWS CloudFormation

### NLP & Machine Learning Engineer, INAGO Inc.

Toronto, Canada · Jul 2018 - Jun 2021

Built NLP and language-understanding systems end to end, from data preparation and model training to evaluation and application integration, including transformer fine-tuning and research collaborations with university and industry partners.

**Automated Question Generation: Fine-Tuned T5** · Research · 2020

Fine-tuned the open-weights **T5** model to generate questions from documents, **cutting manual data-curation effort by 40%**. Experimented with input representations and evaluated generated text with BLEURT in a research collaboration with university partners.

*Tech & Skills:* Python, PyTorch, Hugging Face Transformers, T5, BLEURT

**Conversational Question Answering with NLP & LSTM Models** · Research · 2018

Developed a **conversational question-answering system** combining syntactic and semantic document analysis with **LSTM-based text tagging**. Used **semi-automatically generated ontologies** to interpret user questions and identify intent, and experimented with knowledge graphs for knowledge representation in an industry research collaboration.

*Tech & Skills:* Python, spaCy, LSTM, Text Tagging, Semi-Automatic Ontology Generation, Knowledge Graphs

**Domain-Specific Language Understanding** · Research · 2019

Trained domain-specific **Word2Vec embeddings** and **LSTM-based NLU models**, with interpretability testing to make model decisions transparent.

*Tech & Skills:* Python, PyTorch, Word2Vec, LSTM

## Education

- **M.Sc. in Computer Science**, York University, Toronto, Canada · 2014 - 2018 · GPA 8.17 / 9
  *Thesis: Interactive Question Answering Using Frame-based Knowledge Representation*
- **B.Sc. in Computer Engineering**, Amirkabir University of Technology, Tehran, Iran · 2010 - 2014 · GPA 17.18 / 20

## Publications

- *Question-worthy Sentence Selection for Question Generation*, Canadian AI 2020, 2020 (co-authored)
- *Time Aware Topic-based Recommender System*, Big Data & Information Analytics, 2016 (co-authored)
- *A Study on Prediction of User's Tendency Toward Purchases in Websites based on Behavior Models*, Information and Knowledge Technology (IKT), 6th Conference, IEEE, 2014 (co-authored)
- *Interactive Question Answering Using Frame-based Knowledge Representation*, York University M.Sc. Thesis, 2018
