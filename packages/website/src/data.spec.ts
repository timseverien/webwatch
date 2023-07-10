import { describe, expect, test } from 'vitest';
import {
	Specification,
	SpecificationStage,
	getSpecificationStage,
} from './data';

describe(getSpecificationStage.name, () => {
	test.each<[Specification, SpecificationStage]>([
		[
			{
				type: 'TC39_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 0,
				tags: ['ECMA262'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'TC39_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 1,
				tags: ['ECMA262'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'TC39_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 2,
				tags: ['ECMA262'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'TC39_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 3,
				tags: ['ECMA262'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'TC39_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 4,
				tags: ['ECMA262'],
				links: [],
			},
			'COMPLETED',
		],
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 'WD',
				tags: ['CSS'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 'CR',
				tags: ['CSS'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 'PR',
				tags: ['CSS'],
				links: [],
			},
			'UPCOMING',
		],
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				lastUpdated: new Date(),
				specificationUrl: 'https://example.com/spec',
				maturity: 'REC',
				tags: ['CSS'],
				links: [],
			},
			'COMPLETED',
		],
	])('given %j, returns %s', (specification, expectedResult) => {
		const result = getSpecificationStage(specification);
		expect(result).toBe(expectedResult);
	});
});
