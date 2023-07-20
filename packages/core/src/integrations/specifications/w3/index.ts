import type {
	GenericSpecification,
	SpecificationIntegration,
	SpecificationSerialized,
} from '../index.js';
import { getSpecifications } from './client.js';

// This list is ordered
// See: https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
export const W3_SPECIFICATION_LEVELS = ['WD', 'CR', 'PR', 'REC'] as const;
export type W3SpecificationLevel = (typeof W3_SPECIFICATION_LEVELS)[number];

export const W3_SPECIFICATION_LEVEL_LABEL_MAP: {
	[level in W3SpecificationLevel]: string;
} = {
	CR: 'Candidate Recommendation',
	PR: 'Proposed Recommendation',
	REC: 'Recommendation',
	WD: 'Working Draft',
};

export const W3_SPECIFICATION_TAG_LABEL_MAP = {
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

export type W3SpecificationTag = keyof typeof W3_SPECIFICATION_TAG_LABEL_MAP;

export const W3_SPECIFICATION_TAGS = Object.keys(
	W3_SPECIFICATION_TAG_LABEL_MAP,
) as W3SpecificationTag[];

export type W3Specification = GenericSpecification<
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
