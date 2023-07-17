import axios from 'axios';
import { load } from 'cheerio';
import { parse } from 'date-fns';
import {
	W3_SPECIFICATION_TAGS,
	type W3Specification,
	type W3SpecificationLevel,
	type W3SpecificationTag,
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

export async function getSpecifications(): Promise<W3Specification[]> {
	const response = await client.get<string>('/TR/', {
		params: {
			'status[]': ['draftStandard', 'candidateStandard', 'standard'],
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
						maturity: level,
						specificationUrl: specUrl,
						lastUpdated: dateString
							? parse(dateString, 'yyyy-MM-dd', new Date(0))
							: null,
						tags: tags.filter((tag): tag is W3SpecificationTag =>
							(W3_SPECIFICATION_TAGS as readonly string[]).includes(tag),
						),
						links: [],
					});
				});
		},
	);

	return specs;
}
