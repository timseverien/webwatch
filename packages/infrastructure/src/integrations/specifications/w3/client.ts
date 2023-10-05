import type { SpecificationStatus } from '@spectakel/core/src/specification/index.js';
import { tryParseDate } from '@spectakel/core/src/utils/date.js';
import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { getYear, isValid, parseISO } from 'date-fns';
import {
	SpecificationPublisherVirtual,
	SpecificationVersionVirtual,
	SpecificationVirtual,
	getSpecificationVersionDateFromUrl,
	isSpecificationVersionUrl,
} from '../../../database/specification.js';
import {
	SpecificationParseError,
	SpecificationParserTestError,
} from '../shared.js';

type SpecificationStatusAndDate = { status: SpecificationStatus; date: Date };

function getSpecificationStatusAndDateFromUrlOrParseString(
	url: string,
	{
		status,
		date,
		dateFormats,
	}: {
		status: string | null | undefined;
		date: string | null | undefined;
		dateFormats?: string[];
	},
): SpecificationStatusAndDate {
	if (isSpecificationVersionUrl(url)) {
		return {
			status: 'DRAFT',
			date: getSpecificationVersionDateFromUrl(url),
		};
	}

	if (!status) {
		throw new SpecificationParseError({
			url,
			reason: `Unable to find status to parse`,
		});
	}

	if (!date) {
		throw new SpecificationParseError({
			url: url,
			reason: 'Unable to find date to parse',
		});
	}

	const dateParsed = dateFormats
		? tryParseDate(date.trim().replace(/\s+/g, ' '), dateFormats)
		: parseISO(date);

	if (dateParsed === null || !isValid(dateParsed)) {
		throw new SpecificationParseError({
			url,
			reason: `Unable to parse date: "${date}"`,
		});
	}

	return {
		status: getStatusFromMaturityText(status),
		date: dateParsed,
	};
}

const SPECIFICATION_VERSION_TEST_MAP: {
	[version: string]: (
		doc: CheerioAPI,
		context: { publishYear: number; url: string },
	) => SpecificationVersionVirtual;
} = {
	// v1(doc: CheerioAPI, { publishYear, url }) {
	// 	const isPublishYearValid: boolean = publishYear <= 2014;
	// 	const isDocumentValid: boolean =
	// 		doc('[property="dcterms:issued"]').length > 0;

	// 	if (!isPublishYearValid || !isDocumentValid) {
	// 		throw new SpecificationParserTestError({
	// 			version: 'v1',
	// 			documentTestResult: isDocumentValid,
	// 			yearTestResult: isPublishYearValid,
	// 		});
	// 	}

	// 	const name = doc('#title').text();
	// 	const issuedContainer = doc('[property="dcterms:issued"]');
	// 	const status = issuedContainer
	// 		.text()
	// 		.replace(/^([a-z0-9]\s*[a-z]).+?/i, '$1');
	// 	const date = issuedContainer.attr('content');

	// 	if (!date) {
	// 		throw new SpecificationParseError({
	// 			url: url,
	// 			reason: 'Unable to find date to parse',
	// 		});
	// 	}

	// 	const dateParsed = parseIsoDateStrict(date);

	// 	return {
	// 		name,
	// 		status: getStatusFromMaturityText(status),
	// 		url: url,
	// 		publishDate: status === 'PUBLISHED' ? dateParsed : null,
	// 		revisionDate: dateParsed,
	// 	};
	// },

	// v2(doc, { publishYear, url }) {
	// 	const isPublishYearValid: boolean = publishYear <= 2021;
	// 	const isDocumentValid: boolean = doc('.head').length > 0;

	// 	if (!isPublishYearValid || !isDocumentValid) {
	// 		throw new SpecificationParserTestError({
	// 			version: 'v2',
	// 			documentTestResult: isDocumentValid,
	// 			yearTestResult: isPublishYearValid,
	// 		});
	// 	}

	// 	const name = doc('#title').text();
	// 	const container = doc('.head').first();
	// 	const textWithStatusAndDate = container.find('h2').text().trim();

	// 	const { date: dateString = null, status: statusString = null } =
	// 		textWithStatusAndDate.match(
	// 			/^W3C\s+(?<status>.+?)\s+(?<date>[012]?[0-9]\s+[a-z]+\s+[0-9]{4})$/i,
	// 		)?.groups ?? {};

	// 	const { date, status } = getSpecificationStatusAndDateFromUrlOrParseString(
	// 		url,
	// 		{
	// 			date: dateString,
	// 			status: statusString,
	// 			dateFormats: ['dd MMMM yyyy', 'd MMMM yyyy'],
	// 		},
	// 	);

	// 	return {
	// 		name,
	// 		status,
	// 		url,
	// 		publishDate: status === 'PUBLISHED' ? date : null,
	// 		revisionDate: date,
	// 	};
	// },

	v3(doc, { url }) {
		const $container = doc('#w3c-state');

		const isPublishYearValid: boolean = true;
		const isDocumentValid: boolean = $container.length > 0;

		if (!isPublishYearValid || !isDocumentValid) {
			throw new SpecificationParserTestError({
				version: 'v3',
				documentTestResult: isDocumentValid,
				yearTestResult: isPublishYearValid,
			});
		}

		const name = doc('#title').text();
		const { status, date } = getSpecificationStatusAndDateFromUrlOrParseString(
			url,
			{
				status: $container.find('a').text(),
				date: $container.find('.dt-published').attr('datetime'),
			},
		);

		return {
			name,
			status,
			url,
			publishDate: status === 'PUBLISHED' ? date : null,
			revisionDate: date,
		};
	},
};

const client = axios.create({
	baseURL: 'https://www.w3.org/',
});

function getYearFromSpecificationUrl(url: string) {
	const { year = null } = /\/TR\/(?<year>[0-9]{4})\//.exec(url)?.groups ?? {};
	return year ? Number.parseInt(year) : null;
}

function getStatusFromMaturityText(maturity: string): SpecificationStatus {
	if (maturity.toLowerCase().includes('w3c recommendation')) {
		return 'PUBLISHED';
	}
	return 'DRAFT';
}

const SPECIFICATION_PUBLISHER: SpecificationPublisherVirtual = {
	key: 'W3',
	name: 'W3',
	url: 'https://www.w3.org',
};

export function getHistoryUrlFromSpecificationUrl(url: string) {
	return url.replace(
		/^https:\/\/www.w3.org\/TR\//,
		'https://www.w3.org/standards/history/',
	);
}

export async function getSpecificationVersion(
	url: string,
): Promise<SpecificationVersionVirtual> {
	const response = await client.get<string>(url);
	const $ = load(response.data);

	const errors: (SpecificationParseError | SpecificationParserTestError)[] = [];

	for (const getSpecVersion of Object.values(SPECIFICATION_VERSION_TEST_MAP)) {
		try {
			return getSpecVersion($, {
				publishYear: getYearFromSpecificationUrl(url) ?? getYear(new Date()),
				url,
			});
		} catch (error) {
			errors.push(error as SpecificationParserTestError);
		}
	}

	for (const error of errors) {
		if (error instanceof SpecificationParseError) {
			console.error(`Failed to parse: ${url}\n${error.detail.reason}`);
			console.error(error.detail);
			continue;
		}
		if (error instanceof SpecificationParserTestError) {
			console.error(
				`Failed to parse: ${url}\nSpecification didn’t meet requirements`,
			);
			console.error(error.detail);
			continue;
		}
		console.error(error);
	}

	throw new SpecificationParseError({
		url: url,
		reason: 'Unknown document version',
	});
}

export async function* getSpecificationVersions(
	specificationUrl: string,
): AsyncGenerator<SpecificationVersionVirtual, void> {
	const response = await client.get<string>(
		getHistoryUrlFromSpecificationUrl(specificationUrl),
	);
	const $ = load(response.data);

	const versionedUrls = $('#main a')
		.toArray()
		.map((element) => element.attribs.href)
		.filter((url) => url.startsWith('https://www.w3.org/TR/'))
		// Remove notes
		.filter((url) => !url.includes('/NOTE-'));

	for (const specVersionUrl of versionedUrls) {
		try {
			yield await getSpecificationVersion(specVersionUrl);
		} catch (error) {
			console.error('Unable to parse', specVersionUrl);
		}
	}
}

export async function* getSpecifications(): AsyncGenerator<SpecificationVirtual> {
	const response = await client.get<string>('/TR/', {
		params: {
			'status[]': ['draftStandard', 'candidateStandard', 'standard'],
		},
	});

	const $ = load(response.data);

	for (const familyContainerElement of $(
		'.tr-list > .family-grouping',
	).toArray()) {
		const $familyContainer = $(familyContainerElement);

		for (const specContainerElement of $familyContainer
			.find('> .tr-list__item')
			.toArray()) {
			const $specContainer = $(specContainerElement);
			const $specHeader = $specContainer.find('.tr-list__item__header');
			const $specHeading = $specHeader.children('h3');

			const name = $specHeading.text().trim();
			const specUrl = $specHeading.children('a').attr('href');
			const status = getStatusFromMaturityText(
				$specHeader.children('.maturity-level').text(),
			);
			// const tags = $specContainer
			// 	.children('dl.inline')
			// 	.children()
			// 	.first()
			// 	.children()
			// 	.slice(1)
			// 	.map((index, element) => $(element).text())
			// 	.toArray();

			if (!status) continue;
			if (!specUrl) continue;

			const versions: SpecificationVersionVirtual[] = [];
			for await (const version of getSpecificationVersions(specUrl)) {
				versions.push(version);
			}

			yield {
				name: name,
				alternativeName: null,
				publisher: SPECIFICATION_PUBLISHER,
				url: specUrl,
				updateDate: new Date(),
				tags: [],
				versions,
				links: [],
			};
		}
	}
}
