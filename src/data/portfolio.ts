import resume from "./resume.json";
import type { Project } from "../lib/resume";

// Website storytelling references the resume; career facts stay in resume.json.
const projectIds: Record<string, string> = {
  "Entity Resolution Retraining & Snowflake Pipelines: CLEAR":
    "model-retraining",
  "Agentic Investigation System: CLEAR Investigate": "agent-tooling",
  "CLEAR Business AI: GenAI Report Summarization": "grounded-summarization",
  "Entity Resolution Data Infrastructure: CLEAR KYC/AML":
    "research-infrastructure",
  "Semantic Search Improvement: Checkpoint Tax Research": "semantic-search",
  "Automated Question Generation from Documents": "question-generation",
  "Domain-Specific Language Understanding": "language-understanding",
  "Conversational Question Answering": "conversational-qa",
};
export const identity = resume.basics;
export const contactLinks = {
  email: `mailto:${identity.email}`,
  github: `https://${identity.github}`,
  linkedin: `https://${identity.linkedin}`,
};
export const career = resume.experience.map((job) => ({
  ...job,
  projects: job.projects.map((project: Project) => {
    const id = projectIds[project.name];
    if (!id)
      throw new Error(`Add a portfolio ID for resume project: ${project.name}`);
    return { ...project, id, employer: job.company };
  }),
}));
const projects = career.flatMap((job) => job.projects);
function project(id: string) {
  const found = projects.find((entry) => entry.id === id);
  if (!found)
    throw new Error(`Portfolio story references missing resume project: ${id}`);
  return found;
}
export const featuredWork = [
  {
    project: project("grounded-summarization"),
    title: "Grounded summaries for complex business reports",
    discipline: "LLM applications",
    shortTitle: "Grounded report summarization",
    overview:
      "Turning long entity reports into useful summaries, with claims linked to their sources.",
    contribution:
      "I built the LLM summarization workflow for CLEAR Business AI: selective XML extraction, targeted calls for individual report sections, and source links for summary claims. I integrated search and LLM verification to help distinguish entities with the same name, then refined extraction and prompts through subject matter expert feedback.",
    result: "In production, processing hundreds of reports daily.",
    resultLabel: "Production use",
    process: [
      {
        label: "Select context",
        text: "Relevant XML fields and report sections",
      },
      { label: "Summarize", text: "Targeted LLM calls for each section" },
      { label: "Ground claims", text: "Source links and entity verification" },
    ],
    consideration:
      "The engineering challenge was deciding which context each call needed, keeping claims traceable, and incorporating expert feedback into the next iteration.",
  },
  {
    project: project("model-retraining"),
    title: "Making research experiments repeatable",
    discipline: "ML infrastructure",
    shortTitle: "Reproducible model retraining",
    overview:
      "An on-demand workflow that turns research code into reusable, tracked experiments.",
    contribution:
      "I designed, implemented, and tested a SageMaker Pipelines retraining workflow for CLEAR’s entity-resolution research. Researchers’ feature-generation, training, and evaluation code became reusable DAG steps, with parallel experiments tracked in MLflow. Alongside that internal workflow, I built Snowflake proofs of concept to assess migration feasibility.",
    result:
      "An estimated ~40% reduction in researcher time per experiment round.",
    resultLabel: "Research workflow",
    process: [
      { label: "Prepare features", text: "Reusable research processing steps" },
      { label: "Train & evaluate", text: "On-demand SageMaker workflow" },
      { label: "Track experiments", text: "Parallel runs recorded in MLflow" },
    ],
    consideration:
      "The retraining workflow was an internal research tool. The Snowflake work was proof of concept. The time saving reflects an estimate of researcher effort per experiment round.",
  },
  {
    project: project("agent-tooling"),
    title: "Making investigation agents easier to configure",
    discipline: "Agent tooling & evaluation",
    shortTitle: "Agent configuration & evaluation",
    overview:
      "A central place to configure prompts, tools, and agent connections in CLEAR Investigate.",
    contribution:
      "I contributed to CLEAR Investigate, Thomson Reuters’ commercially launched agentic investigation product. My work focused on a PydanticAI configuration layer for system prompts, tool definitions, and agent/subagent wiring. I also migrated existing LLM-as-judge evaluation tooling into a reusable repository.",
    result:
      "Agent definitions could be reconfigured from one place instead of across many files.",
    resultLabel: "Team workflow",
    process: [
      { label: "Configure prompts", text: "Central system-prompt definitions" },
      { label: "Connect tools", text: "Tool definitions and agent wiring" },
      { label: "Support evaluation", text: "Reusable LLM-as-judge tooling" },
    ],
    consideration:
      "Configuration brought prompts, tool definitions, and agent connections together so the team could change them consistently. The evaluation work organized an existing LLM-as-judge capability into a repository the team could reuse.",
  },
];
export const expertise = [
  {
    category: "LLM & Agentic AI",
    featured: [
      "PydanticAI",
      "Prompt Engineering",
      "LLM Evaluation (LLM-as-Judge)",
      "OpenAI API",
    ],
    description:
      "Grounded generation, prompt and tool configuration, and evaluation informed by domain experts.",
    evidence: "grounded-summarization",
    evidenceLabel: "See summarization work",
  },
  {
    category: "Machine Learning & NLP",
    featured: [
      "PyTorch",
      "Transformers (Hugging Face)",
      "Sentence Embeddings",
      "Semantic Search",
    ],
    description:
      "Language understanding, sentence embeddings, and search that reflects the intent of a question.",
    evidence: "semantic-search",
    evidenceLabel: "See semantic search work",
  },
  {
    category: "MLOps, Data & Cloud",
    featured: [
      "AWS SageMaker (Studio, Pipelines)",
      "Apache Spark (PySpark)",
      "Experiment Tracking (MLflow)",
      "Snowflake",
    ],
    description:
      "Reusable training workflows and secure data foundations that help researchers run better experiments.",
    evidence: "model-retraining",
    evidenceLabel: "See retraining work",
  },
  {
    category: "Languages & Practices",
    featured: ["Python", "Java", "Scala", "Bash"],
    description:
      "Research code turned into tested, reproducible components, in close collaboration with researchers and product engineers.",
    evidence: "research-infrastructure",
    evidenceLabel: "See infrastructure work",
  },
].map((entry) => {
  const group = resume.skills.find(
    (skill) => skill.category === entry.category,
  );
  if (!group)
    throw new Error(`Missing resume skill category: ${entry.category}`);
  for (const skill of entry.featured) {
    if (!group.items.includes(skill))
      throw new Error(`Missing featured resume skill: ${skill}`);
  }
  return {
    ...entry,
    more: group.items.filter((skill) => !entry.featured.includes(skill)),
  };
});
// Public README verified 2026-10-16. Never add private projects here.
export const personalProject = {
  name: "PomoCLI",
  url: "https://github.com/emadg/pomocli",
  description:
    "A small tool for a real everyday problem: keeping track of focused work. A Python command-line timer with git-aware sessions, a live terminal dashboard, and a companion macOS menu-bar app.",
  technologies: "Python · SQLite · Swift",
};
export { resume };
