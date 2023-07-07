import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
import {
	W3_SPECIFICATION_TYPES,
	type W3Specification,
} from '@ww/core/src/integrations/w3';

export type Specification = Tc39Specification | W3Specification;

const SPECIFICATION_STAGES = ['IDEATION', 'UPCOMING', 'COMPLETED'] as const;
export type SpecificationStage = (typeof SPECIFICATION_STAGES)[number];

export const TYPE_THEME_COLOR_MAP: {
	[key in Specification['type']]: { foreground: string; background: string };
} = {
	CSS_SPECIFICATION: { background: '#274de3', foreground: 'white' },
	DOM_SPECIFICATION: { background: 'black', foreground: 'white' },
	HTML_SPECIFICATION: { background: '#e54c20', foreground: 'white' },
	JSON_LD_SPECIFICATION: { background: '#0d479c', foreground: 'white' },
	SVG_SPECIFICATION: { background: '#ff9a01', foreground: 'white' },
	TC39_SPECIFICATION: { background: '#f7e018', foreground: 'black' },
	URI_SPECIFICATION: { background: 'black', foreground: 'white' },
	W3_SPECIFICATION: { background: '#005a9c', foreground: 'white' },
	WAI_ARIA_SPECIFICATION: { background: '#005a9c', foreground: 'white' },
	WASM_SPECIFICATION: { background: '#654ff0', foreground: 'white' },
	WEB_API_SPECIFICATION: { background: 'black', foreground: 'white' },
};

export function isTc39Specification(
	spec: Specification,
): spec is Tc39Specification {
	return spec.type === 'TC39_SPECIFICATION';
}

export function isW3Specification(
	spec: Specification,
): spec is W3Specification {
	return (W3_SPECIFICATION_TYPES as readonly string[]).includes(spec.type);
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
	if (isTc39Specification(spec)) {
		return getSpecificationStageFromTc39Specification(spec);
	}
	if (isW3Specification(spec)) {
		return getSpecificationStageFromW3Specification(spec);
	}
	throw new Error('Unknown specification type');
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
