import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
import {
	W3_SPECIFICATION_TYPES,
	type W3Specification,
} from '@ww/core/src/integrations/w3';

const SPECIFICATION_STAGES = ['IDEATION', 'UPCOMING', 'COMPLETED'] as const;

export type Specification = Tc39Specification | W3Specification;
export type SpecificationStage = (typeof SPECIFICATION_STAGES)[number];

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

function getSpecificationStage(spec: Specification): SpecificationStage {
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
