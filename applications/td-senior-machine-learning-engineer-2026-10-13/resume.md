# Emad Gohari
Senior Machine Learning Engineer · ML Systems, NLP, GenAI

Toronto, ON, Canada | E.Gohari.B@gmail.com | github.com/emadg | linkedin.com/in/emad-gohari | EmadGohari.com

## Summary

Senior machine learning engineer with **8 years of experience** delivering ML, NLP, and LLM systems from research to production. At Thomson Reuters Labs, built **reproducible training pipelines and PII-isolated infrastructure**, shipped **production GenAI summarization and semantic search**, and contributed agent configuration and evaluation tooling to a commercially launched AI product. Collaborates with researchers, domain experts, and product engineers.

## Technical Skills

- **ML & Deep Learning:** PyTorch, Hugging Face Transformers, scikit-learn, XGBoost, Transformer Fine-Tuning (T5), LSTM, Clustering Models, Model Training & Evaluation (F1 Score, ROC-AUC, MRR, MAP, Recall@k)
- **MLOps, Data & Cloud:** AWS SageMaker (Studio, Pipelines), MLflow, Apache Spark (PySpark), Snowflake, AWS CloudFormation, Data Pipelines, DAG Orchestration, PII Handling
- **GenAI & NLP:** LLM Applications, Agentic Frameworks (PydanticAI), Prompt & Context Engineering, LLM Evaluation (LLM-as-Judge, SME Review), GPT-4, Claude, Sentence Embeddings, Semantic Search, Text Classification & Tagging, Knowledge Graphs & Ontologies
- **Languages & Libraries:** Python, Java, Scala, Bash, pandas, NumPy, spaCy

## Experience

### Senior Machine Learning Engineer II (Research) at Thomson Reuters
Jul 2021 - Present | Toronto, Canada

Built ML systems at TR Labs for CLEAR's KYC/AML screening and investigations, and Checkpoint tax research. Worked with researchers, domain experts, and product engineers on data infrastructure and customer-facing features.

#### Work Projects

##### Model Retraining & Experimentation Pipelines: CLEAR
2026 | internal

Designed, implemented, and tested an **on-demand SageMaker retraining pipeline**, turning researchers' feature-generation, training, and evaluation code into reusable DAG steps. Enabled **parallel experiments tracked in MLflow**, cutting researcher time per round by an **estimated ~40%**. Extended reusable Python/PySpark components; built **Snowflake processing and training proofs of concept** and assessed migration gaps.

**Tech & Skills:** Python, AWS SageMaker Pipelines, MLflow, PySpark, Snowflake, XGBoost

##### GenAI Report Summarization: CLEAR Business AI
2024 | production

Built an LLM summarization workflow **live in production processing hundreds of reports daily**, with selective XML extraction and targeted per-section calls. Integrated **Bing Search, LLM verification, and source links** to reduce same-name entity mismatches. Refined extraction and prompts through SME reviews; compared **GPT-4 and Claude Sonnet on quality, latency, and cost** to inform model selection.

**Tech & Skills:** Python, GPT-4, Claude Sonnet, Bing Search API, XML Processing, LLM Evaluation

##### Entity Resolution Data Infrastructure: CLEAR KYC/AML
2022 - 2024 | internal

Built research infrastructure for an entity-resolution system spanning **~800M entities and billions of documents**. Designed a **PII-isolated SageMaker/CloudFormation environment** with researcher-specific profiles; defined a **versioned JSON schema** reconciling two annotation sources with Spark/Python normalization, merging, and conflict checks; and automated manual runs into **scheduled SageMaker Pipelines**.

**Tech & Skills:** Python, Apache Spark (PySpark), AWS SageMaker, CloudFormation

##### Agent Configuration & Evaluation: CLEAR Investigate
2025 - 2026 | production

Contributed to **commercially launched CLEAR Investigate**. Built a central PydanticAI layer for prompts, tool descriptions/availability, and agent/subagent wiring, enabling **agent reconfiguration from one place**. Migrated existing **LLM-as-judge tooling** into a repository for reuse and future CI/CD integration.

**Tech & Skills:** Python, PydanticAI, Claude, Agent Configuration, LLM-as-Judge

##### Semantic Search Query Understanding: Checkpoint
2021 | production

Shipped a **sentence-embedding query-intent classifier** separating broad conceptual queries from specific tax lookups to promote higher-level documents. **Improved access to conceptual documents by 95%** within a **~100ms latency budget**, addressing a retrieval gap identified with SMEs and customer feedback.

**Tech & Skills:** Python, Sentence Embeddings, Text Classification, Semantic Search

### NLP & Machine Learning Engineer at INAGO Inc.
Jul 2018 - Jun 2021 | Toronto, Canada

Built NLP systems across data preparation, training, evaluation, and application integration with research partners. Trained domain-specific Word2Vec embeddings and LSTM NLU models with interpretability testing.

#### Work Projects

##### Transformer Fine-Tuning for Question Generation
2020 | research

Fine-tuned **T5 in PyTorch/Hugging Face** to generate questions from documents, **cutting manual data-curation effort by 40%**. Experimented with input representations and evaluated output using BLEURT with university research partners.

**Tech & Skills:** Python, PyTorch, Hugging Face Transformers, T5, BLEURT

##### Conversational Question Answering with NLP & LSTM Models
2018 | research

Developed **conversational question answering** combining document analysis and **LSTM-based text tagging**. Used semi-automatically generated ontologies to interpret questions and intent; experimented with knowledge graphs in an industry research collaboration.

**Tech & Skills:** Python, spaCy, LSTM, Text Tagging, Ontologies, Knowledge Graphs

## Education

### M.Sc. in Computer Science, York University
2014 - 2018 | Toronto, Canada
Thesis: Interactive Question Answering Using Frame-based Knowledge Representation

### B.Sc. in Computer Engineering, Amirkabir University of Technology
2010 - 2014 | Tehran, Iran

## Publications

- **Question-worthy Sentence Selection for Question Generation** - Canadian AI 2020, 2020 (co-authored)
- **Time Aware Topic-based Recommender System** - Big Data & Information Analytics, 2016 (co-authored)
- **A Study on Prediction of User's Tendency Toward Purchases in Websites based on Behavior Models** - Information and Knowledge Technology (IKT), 6th Conference, IEEE, 2014 (co-authored)
