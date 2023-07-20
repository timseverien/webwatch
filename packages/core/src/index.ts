import { INTEGRATION_2ALITY } from './integrations/links/2ality/index.js';
import { Specification } from './integrations/specifications/index.js';

const spec: Specification = {
	type: 'TC39_SPECIFICATION',
	name: 'New Set methods',
	specificationUrl: 'https://tc39.es/proposal-set-methods',
	maturity: 3,
	lastUpdated: new Date(Date.parse('2023-07-17T22:00:00.000Z')),
	tags: ['ECMA262'],
	links: [],
};

const links = await INTEGRATION_2ALITY.getLinksBySpecification(spec);
console.log({ spec: spec.name, links: links.map((l) => l.url) });
