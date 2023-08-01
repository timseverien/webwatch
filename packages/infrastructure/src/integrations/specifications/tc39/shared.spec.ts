import { describe, expect, test } from 'vitest';
import {
	getProposalUrlFromSpecificationUrl,
	getSpecificationUrlFromProposalUrl,
} from './shared.js';

describe(getSpecificationUrlFromProposalUrl.name, () => {
	test.each<[string, string]>([
		[
			'https://github.com/tc39/proposal-example',
			'https://tc39.es/proposal-example',
		],
		[
			'https://github.com/example/example',
			'https://github.com/example/example',
		],
		['https://example.com/example', 'https://example.com/example'],
	])('given %s, return %s', (specificationUrl, expectedResult) => {
		const result = getSpecificationUrlFromProposalUrl(specificationUrl);
		expect(result).toBe(expectedResult);
	});
});

describe(getProposalUrlFromSpecificationUrl.name, () => {
	test.each<[string, string]>([
		[
			'https://tc39.es/proposal-example',
			'https://github.com/tc39/proposal-example',
		],
		[
			'https://github.com/example/example',
			'https://github.com/example/example',
		],
		['https://example.com/example', 'https://example.com/example'],
	])('given %s, return %s', (proposalUrl, expectedResult) => {
		const result = getProposalUrlFromSpecificationUrl(proposalUrl);
		expect(result).toBe(expectedResult);
	});
});
