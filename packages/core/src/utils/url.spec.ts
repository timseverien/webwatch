import { describe, expect, test } from 'vitest';
import { getHumanReadableDomain, getHumanReadableUrl } from './url.js';

describe(getHumanReadableDomain.name, () => {
	test.each<[string, string]>([
		['https://www.example.com', 'example.com'],
		['https://www.example.com/path', 'example.com'],
		['https://www.example.com/path?a=b&c=d', 'example.com'],
	])('given %j, returns %j', (url, expectedResult) => {
		const result = getHumanReadableDomain(url);
		expect(result).toEqual(expectedResult);
	});
});

describe(getHumanReadableUrl.name, () => {
	test.each<[string, string]>([
		['example.com', 'example.com'],
		['https://www.example.com', 'example.com'],
		['https://www.example.com/path', 'example.com/path'],
		['https://www.example.com/path?a=b&c=d', 'example.com/path'],
	])('given %j, returns %j', (url, expectedResult) => {
		const result = getHumanReadableUrl(url);
		expect(result).toEqual(expectedResult);
	});
});
