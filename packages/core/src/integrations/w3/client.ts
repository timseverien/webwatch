import axios from 'axios';
import { load } from 'cheerio';
import { parse, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { enUS as localeEnUs } from 'date-fns/locale';
import {
	W3Specification,
	W3SpecificationLevel,
	W3SpecificationTag,
} from './index.js';

const client = axios.create({
	baseURL: 'https://www.w3.org/',
});

function getSpecificationLevelFromMaturityText(
	maturity: string,
): W3SpecificationLevel | null {
	switch (maturity) {
		case 'Draft Standard':
			return 'WD';
		case 'Standard':
			return 'REC';
		case 'Candidate Standard':
			return 'CR';
	}

	return null;
}

function parseDate(date: string): Date | null {
	const today = startOfDay(new Date());

	if (/^[0-9]{4}[0-9]{2}[0-9]{2}$/.test(date)) {
		return parse(date, 'yyyyMMdd', today, { locale: localeEnUs });
	}
	if (/^[0-9]{1,2}\s+[a-z]+\s+[0-9]{4}$/i.test(date)) {
		return parse(date, 'd LLLL yyyy', today, { locale: localeEnUs });
	}
	if (/^[a-z]+\s+[0-9]{4}$/i.test(date)) {
		return parse(date, 'd LLLL yyyy', startOfMonth(today), {
			locale: localeEnUs,
		});
	}
	// Some specifications only have a year specified, so just set the date to the beginning of that year
	if (/^[0-9]{4}$/.test(date)) {
		return parse(date, 'yyyy', startOfYear(today), {
			locale: localeEnUs,
		});
	}

	return null;
}

export async function getSpecifications(): Promise<W3Specification[]> {
	const response = await client.get<string>('/TR/', {
		params: {
			'status[]': ['a', 'b', 'c'],
		},
	});

	const $ = load(response.data);
	const specs: W3Specification[] = [];

	$('.tr-list > .family-grouping').each(
		(familyIndex, familyContainerElement) => {
			const $familyContainer = $(familyContainerElement);
			const familyName = $familyContainer.find('> h2').text().trim();

			$familyContainer
				.find('> .tr-list__item')
				.each((specIndex, specContainerElement) => {
					const $specContainer = $(specContainerElement);
					const $specHeader = $specContainer.find('.tr-list__item__header');
					const $specHeading = $specHeader.children('h3');

					const name = $specHeading.text().trim();
					const specUrl = $specHeading.children('a').attr('href');
					const level = getSpecificationLevelFromMaturityText(
						$specHeader.children('.maturity-level').text(),
					);
					const dateString = $specContainer.find('time').attr('datetime');
					const tags = $specContainer
						.children('dl.inline')
						.children()
						.first()
						.children()
						.slice(1)
						.map((index, element) => $(element).text())
						.toArray();

					if (!level) return;
					if (!specUrl) return;

					specs.push({
						type: 'W3_SPECIFICATION',
						name,
						level: level,
						specificationUrl: specUrl,
						lastUpdated: dateString
							? parse(dateString, 'yyyy-MM-dd', new Date(0))
							: null,
						tags: tags as W3SpecificationTag[],
					});
				});
		},
	);

	return specs;
}
