import type {
	Specification,
	SpecificationIntegration,
	SpecificationSerialized,
} from '../index.js';
import { getSpecifications } from './client.js';

// This list is ordered
// See: https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
export const W3_SPECIFICATION_LEVELS = [
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

export type W3Specification = Specification<
	'W3_SPECIFICATION',
	W3SpecificationLevel,
	W3SpecificationTag
>;

export type W3SpecificationSerialized =
	SpecificationSerialized<W3Specification>;

export const W3_INTEGRATION: SpecificationIntegration<W3Specification> = {
	getSpecifications,

	serialize(data) {
		return data.map<W3SpecificationSerialized>((d) => ({
			...d,
			lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
		}));
	},

	deserialize(data) {
		return data.map<W3Specification>((d) => ({
			...d,
			lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
		}));
	},
};
