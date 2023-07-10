import { describe, expect, test } from 'vitest';
import { getRepositoryReadmeUrl } from './github.js';

describe(getRepositoryReadmeUrl.name, () => {
	test.each<[string, string]>([
		[
			'https://github.com/timseverien/webwatch',
			'https://raw.githubusercontent.com/timseverien/webwatch/master/README.md',
		],
	])(
		'given repository URL, returns README URL',
		(repositoryUrl, expectedResult) => {
			const result = getRepositoryReadmeUrl(repositoryUrl);
			expect(result).toBe(expectedResult);
		},
	);
});
