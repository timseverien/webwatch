import { describe, expect, test } from 'vitest';
import { SpecificationSerialized } from '../../../specification/index.js';
import { W3Specification, W3_INTEGRATION } from './index.js';

describe(W3_INTEGRATION.serialize.name, () => {
	test.each<[W3Specification, SpecificationSerialized<W3Specification>]>([
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				links: [
					{
						type: 'CAN_I_USE',
						title: 'Can I Use',
						url: 'https://caniuse.com/spec',
					},
				],
				maturity: 'CR',
				specificationUrl: 'https://example.com/spec',
				tags: ['CSS'],
				lastUpdated: new Date(Date.parse('2023-07-10T17:39:42.000Z')),
			},
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				links: [
					{
						type: 'CAN_I_USE',
						title: 'Can I Use',
						url: 'https://caniuse.com/spec',
					},
				],
				maturity: 'CR',
				specificationUrl: 'https://example.com/spec',
				tags: ['CSS'],
				lastUpdated: '2023-07-10T17:39:42.000Z',
			},
		],
	])('given specifications %j, returns %j', (specification, expectedResult) => {
		const result = W3_INTEGRATION.serialize([specification]);
		expect(result).toEqual([expectedResult]);
	});
});

describe(W3_INTEGRATION.deserialize.name, () => {
	test.each<[SpecificationSerialized<W3Specification>, W3Specification]>([
		[
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				links: [
					{
						type: 'CAN_I_USE',
						title: 'Can I Use',
						url: 'https://caniuse.com/spec',
					},
				],
				maturity: 'CR',
				specificationUrl: 'https://example.com/spec',
				tags: ['CSS'],
				lastUpdated: '2023-07-10T17:39:42.000Z',
			},
			{
				type: 'W3_SPECIFICATION',
				name: 'Specification name',
				links: [
					{
						type: 'CAN_I_USE',
						title: 'Can I Use',
						url: 'https://caniuse.com/spec',
					},
				],
				maturity: 'CR',
				specificationUrl: 'https://example.com/spec',
				tags: ['CSS'],
				lastUpdated: new Date(Date.parse('2023-07-10T17:39:42.000Z')),
			},
		],
	])('given specifications %j, returns %j', (specification, expectedResult) => {
		const result = W3_INTEGRATION.deserialize([specification]);
		expect(result).toEqual([expectedResult]);
	});
});
