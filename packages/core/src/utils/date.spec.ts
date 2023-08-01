import { describe, expect, test } from 'vitest';
import { parseIsoDateStrict } from './date.js';

describe(parseIsoDateStrict.name, () => {
	test.each<[string]>([['2023-13-01'], ['2023-99-99']])(
		'given %j, throws',
		(date) => {
			expect(() => parseIsoDateStrict(date)).toThrow();
		},
	);
});
