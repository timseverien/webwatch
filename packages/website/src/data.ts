import type {
	Tc39Specification,
	Tc39SpecificationTag,
} from '@ww/core/src/integrations/tc39';
import type {
	W3Specification,
	W3SpecificationTag,
} from '@ww/core/src/integrations/w3';

export type Specification = Tc39Specification | W3Specification;
export type SpecificationTag = Tc39SpecificationTag | W3SpecificationTag;

export const SPECIFICATION_TAG_LABEL_MAP: {
	[tag in SpecificationTag]: string;
} = {
	Accessibility: 'Accessibility',
	Browser: 'Browser',
	CSS: 'CSS',
	Data: 'Data',
	'Digital Publishing': 'Digital publishing',
	DOM: 'DOM',
	Graphics: 'Graphics',
	HTML: 'HTML',
	HTTP: 'HTTP',
	i18n: 'Internationalization',
	ECMA402: 'JavaScript internationalization API',
	ECMA262: 'JavaScript',
	Media: 'Media',
	Performance: 'Performance',
	Privacy: 'Privacy',
	Protocol: 'Protocol',
	Security: 'Security',
	'Web API': 'Web API',
	'Web Fonts': 'Web fonts',
	WoT: 'Web of Things',
	XML: 'XML',
};

const SPECIFICATION_STAGES = ['IDEATION', 'UPCOMING', 'COMPLETED'] as const;
export type SpecificationStage = (typeof SPECIFICATION_STAGES)[number];

export const SPECIFICATION_STAGE_LABEL_MAP: {
	[stage in SpecificationStage]: string;
} = {
	COMPLETED: 'Completed',
	IDEATION: 'Ideation',
	UPCOMING: 'Upcoming',
};

export function getLabelFromTag(tag: SpecificationTag): string {
	switch (tag) {
		case 'ECMA262':
			return 'JavaScript';
		case 'ECMA402':
			return 'JavaScript Intl API';
		case 'WoT':
			return 'Web of Things';
		default:
			return tag;
	}
}

function getSpecificationStageFromTc39Specification(
	spec: Tc39Specification,
): SpecificationStage {
	if (spec.stage === 4) return 'COMPLETED';
	if (spec.stage === 3) return 'UPCOMING';
	return 'IDEATION';
}

function getSpecificationStageFromW3Specification(
	spec: W3Specification,
): SpecificationStage {
	if (spec.level === 'REC') return 'COMPLETED';
	if (spec.level === 'PR') return 'UPCOMING';
	return 'IDEATION';
}

export function getSpecificationStage(spec: Specification): SpecificationStage {
	switch (spec.type) {
		case 'TC39_SPECIFICATION':
			return getSpecificationStageFromTc39Specification(spec);
		case 'W3_SPECIFICATION':
			return getSpecificationStageFromW3Specification(spec);
		default:
			throw new Error('Unknown specification type');
	}
}

export function isSpecificationInEqualOrLaterStage(
	spec: Specification,
	stage: SpecificationStage,
): boolean {
	const specStage = getSpecificationStage(spec);
	return (
		SPECIFICATION_STAGES.indexOf(specStage) >=
		SPECIFICATION_STAGES.indexOf(stage)
	);
}
