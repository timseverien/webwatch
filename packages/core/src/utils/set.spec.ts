import { describe, expect, test } from 'vitest';
import { getPowerSet } from './set.js';

describe(getPowerSet.name, () => {
	test.each<[string[], string[][]]>([
		[
			['a', 'b', 'c'],
			[
				[],
				['a'],
				['b'],
				['c'],
				['a', 'b'],
				['a', 'c'],
				['b', 'c'],
				['a', 'b', 'c'],
			],
		],
	])('given %j, returns %j', (set, expectedResult) => {
		const result = Array.from(getPowerSet(set)).sort();
		expect(result).toEqual(expectedResult.sort());
	});
});
