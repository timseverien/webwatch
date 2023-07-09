// https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
// This list is ordered
const W3_SPECIFICATION_LEVELS = [
	// Working Draft
	'WD',
	// Candidate Recommendation
	'CR',
	// Proposed Recommendation
	'PR',
	// W3C Recommendation
	'REC',
] as const;

export type W3SpecificationLevel = (typeof W3_SPECIFICATION_LEVELS)[number];

export type W3SpecificationTag =
	| 'Accessibility'
	| 'Browser'
	| 'CSS'
	| 'Data'
	| 'DOM'
	| 'Digital Publishing'
	| 'Graphics'
	| 'HTML'
	| 'HTTP'
	| 'i18n'
	| 'Media'
	| 'Performance'
	| 'Privacy'
	| 'Protocol'
	| 'Security'
	| 'Web API'
	| 'Web Fonts'
	| 'WoT'
	| 'XML';

export function getLevelsEqualOrGreaterThan(
	level: W3SpecificationLevel,
): W3SpecificationLevel[] {
	const index = W3_SPECIFICATION_LEVELS.indexOf(level);
	return W3_SPECIFICATION_LEVELS.slice(index);
}

export function isLevelEqualOrGreaterThan(
	level1: W3SpecificationLevel,
	level2: W3SpecificationLevel,
): boolean {
	const index1 = W3_SPECIFICATION_LEVELS.indexOf(level1);
	const index2 = W3_SPECIFICATION_LEVELS.indexOf(level2);
	return index1 >= index2;
}

export interface W3Specification {
	type: 'W3_SPECIFICATION';
	name: string;
	specificationUrl: string;
	level: W3SpecificationLevel;
	lastUpdated: Date | null;
	tags: W3SpecificationTag[];
}

export interface W3SpecificationSerialized
	extends Omit<W3Specification, 'lastUpdated'> {
	lastUpdated: string | null;
}

export { getSpecifications } from './client.js';

export function serialize(
	data: W3Specification[],
): W3SpecificationSerialized[] {
	return data.map<W3SpecificationSerialized>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
	}));
}

export function deserialize(
	data: W3SpecificationSerialized[],
): W3Specification[] {
	return data.map<W3Specification>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
	}));
}
