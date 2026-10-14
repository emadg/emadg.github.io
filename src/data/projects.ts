/**
 * Portfolio projects shown under /projects.
 *
 * PLACEHOLDERS: the repositories are not public yet and nothing is deployed.
 * Fill in the URL constants below when they are. An empty string means "not
 * available yet": the pages then show a disabled "coming soon" label instead
 * of a link. Nothing else needs to change.
 */

// --- Links to fill in later -------------------------------------------------
/** GitHub URL of fincrime-investigator-agent, e.g. 'https://github.com/emadg/fincrime-investigator-agent'. */
export const FINCRIME_AGENT_REPO_URL = '';
/** Optional live (Cloud Run) deployment of the agent UI. The static replay on this site works without it. */
export const FINCRIME_AGENT_LIVE_URL = '';

/** GitHub URL of sanctions-screening-service. */
export const SANCTIONS_SERVICE_REPO_URL = '';
/** Optional deployed screening API / demo page (Cloud Run). */
export const SANCTIONS_SERVICE_DEMO_URL = '';

/** GitHub URL of filings-extraction-finetune. */
export const FILINGS_FINETUNE_REPO_URL = '';
/** Optional Hugging Face model / adapter page, once GPU training has run. */
export const FILINGS_FINETUNE_MODEL_URL = '';
// ---------------------------------------------------------------------------

export type ProjectStatus = 'complete' | 'in-progress' | 'results-pending';

export interface ProjectLink {
	label: string;
	/** Absolute URL or site path. Empty string = not available yet (rendered disabled). */
	href: string;
	/** Shown in place of the link while href is empty. */
	pendingLabel: string;
}

export interface Project {
	slug: string;
	title: string;
	tagline: string;
	/** Meta description / Open Graph description. */
	description: string;
	status: ProjectStatus;
	statusLabel: string;
	tech: string[];
	/** Short, real numbers for the index card (each backed by a results file in the repo). */
	highlights: string[];
	links: ProjectLink[];
	ogImage: string;
}

export const projects: Project[] = [
	{
		slug: 'fincrime-investigator-agent',
		title: 'Financial-crime investigation agent',
		tagline:
			'A LangGraph agent that screens an entity, walks its ownership graph, reads its SEC filings and writes a risk memo in which every factual sentence cites evidence it retrieved.',
		description:
			'LangGraph investigation agent over OpenSanctions and SEC EDGAR: deterministic risk floor, cited memos, a verifier, a 63-case golden set and a replayable demo.',
		status: 'complete',
		statusLabel: 'Complete',
		tech: ['LangGraph', 'Gemini', 'MCP', 'FastAPI', 'SQLite FTS5', 'OpenTelemetry', 'Docker'],
		highlights: [
			'62/63 risk levels correct with gemini-3.8-flash, 0 under-calls',
			'100% citation validity; 3/3 injection cases flagged, 0 leaks',
			'$0.0091 per investigation at list price',
		],
		links: [
			{ label: 'Replay demo', href: '/projects/fincrime-investigator-agent/#demo', pendingLabel: '' },
			{ label: 'Code', href: FINCRIME_AGENT_REPO_URL, pendingLabel: 'Code: public soon' },
			{ label: 'Live app', href: FINCRIME_AGENT_LIVE_URL, pendingLabel: 'Live app: not deployed' },
		],
		ogImage: '/og/fincrime-investigator-agent.png',
	},
	{
		slug: 'sanctions-screening-service',
		title: 'Real-time sanctions screening service',
		tagline:
			'Name screening over the OpenSanctions consolidated list: n-gram + phonetic candidate generation, a calibrated LightGBM matcher, FastAPI, Kubernetes, drift monitoring and a gated daily refresh.',
		description:
			'Real-time sanctions name screening: calibrated LightGBM matcher, 7 ms p50 on one vCPU, Kubernetes, drift detection and a gated Airflow refresh.',
		status: 'in-progress',
		statusLabel: 'Work in progress',
		tech: ['LightGBM', 'FastAPI', 'Prometheus', 'Kubernetes', 'Airflow', 'Docker', 'Locust'],
		highlights: [
			'95.3% recall vs 90.6% for a fuzzy-matching baseline',
			'PR-AUC 0.931 vs 0.891 for nomenklatura logic-v2',
			'7.2 ms p50 / 27.6 ms p99 server-side on 1 vCPU',
		],
		links: [
			{ label: 'Code', href: SANCTIONS_SERVICE_REPO_URL, pendingLabel: 'Code: public soon' },
			{ label: 'Live API', href: SANCTIONS_SERVICE_DEMO_URL, pendingLabel: 'Live API: not deployed' },
		],
		ogImage: '/og/sanctions-screening-service.png',
	},
	{
		slug: 'filings-extraction-finetune',
		title: 'Grounded ownership extraction with a fine-tuned small LLM',
		tagline:
			'SFT + LoRA + DPO of Qwen3-4B to extract beneficial-ownership tables from SEC proxy statements as strict JSON, where every record quotes the filing verbatim. Served with vLLM.',
		description:
			'Fine-tuning a small open LLM (SFT, LoRA, DPO) for grounded ownership extraction from SEC filings, with a deterministic verifier and vLLM serving. GPU results pending.',
		status: 'results-pending',
		statusLabel: 'Code complete, GPU results pending',
		tech: ['Qwen3-4B', 'TRL', 'LoRA', 'DPO', 'vLLM', 'Gemini (teacher)', 'Colab'],
		highlights: [
			'36/40 teacher labels pass the verifier on real filings',
			'Labeling cost $8.20 per 1k documents',
			'Fine-tuned quality and serving numbers: pending GPU runs',
		],
		links: [
			{ label: 'Code', href: FILINGS_FINETUNE_REPO_URL, pendingLabel: 'Code: public soon' },
			{ label: 'Model', href: FILINGS_FINETUNE_MODEL_URL, pendingLabel: 'Model: not trained yet' },
		],
		ogImage: '/og/filings-extraction-finetune.png',
	},
];

export function getProject(slug: string): Project {
	const project = projects.find((p) => p.slug === slug);
	if (!project) throw new Error(`Unknown project: ${slug}`);
	return project;
}

export function isExternal(href: string): boolean {
	return /^https?:\/\//.test(href);
}
