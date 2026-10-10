import { readFileSync } from 'node:fs';
import defaultData from '../data/resume.json';

export type ResumeData = typeof defaultData;
export type Job = ResumeData['experience'][number];
export type Project = Job['projects'][number] & { highlights?: string[] };

export const STAGE_LABEL: Record<string, string> = {
	production: 'Production',
	internal: 'Internal Tool',
	prototype: 'Prototype',
	poc: 'Proof of Concept',
	research: 'Research',
};

/**
 * Resume data for the current render. Set RESUME_DATA to an absolute path to
 * render a tailored variant (used by `npm run pdf -- --data <file>`).
 */
export function loadResume(): ResumeData {
	const path = process.env.RESUME_DATA;
	if (!path) return defaultData;
	return JSON.parse(readFileSync(path, 'utf8')) as ResumeData;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Escape text, then turn **bold** markup into <strong>. Use with set:html. */
export function renderInline(text: string | null | undefined): string {
	if (!text) return '';
	return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** All projects across jobs, in data order (newest job first). */
export function allProjects(data: ResumeData): Project[] {
	return data.experience.flatMap((job) => job.projects);
}

/** Skill categories flattened into a single list. */
export function allSkills(data: ResumeData): string[] {
	return data.skills.flatMap((group) => group.items);
}
