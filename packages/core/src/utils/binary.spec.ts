import { describe, expect, test } from 'vitest';
import { getPositiveBitOffsets } from './binary.js';

describe(getPositiveBitOffsets.name, () => {
	test.each<[string, number[]]>([
		['000', []],
		['001', [0]],
		['010', [1]],
		['011', [0, 1]],
		['100', [2]],
		['101', [0, 2]],
		['110', [1, 2]],
		['111', [0, 1, 2]],
	])('given %j, returns %j', (set, expectedResult) => {
		const result = Array.from(getPositiveBitOffsets(set));
		expect(result).toEqual(expectedResult);
	});
});
