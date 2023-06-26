import axios from 'axios';
import * as cheerio from 'cheerio';
import { W3SpecificationLevel } from '../index.js';
import { CSSSpecification } from './index.js';

const URL_PROPERTIES = 'https://www.w3.org/Style/CSS/all-properties.en.json';
const URL_DESCRIPTORS = 'https://www.w3.org/Style/CSS/all-descriptors.en.json';

type DescriptorsResponseBody = {
	descriptor: string;
	specification: string; // specification title
	URL: string;
	status: W3SpecificationLevel;
}[];

type PropertiesResponseBody = {
	property: string;
	title: string; // specification title
	url: string;
	status: W3SpecificationLevel;
}[];

function getNormalizedSpecificationUrl(uri: string): string {
	const url = new URL(uri);
	url.hash = '';
	return url.toString();
}

function createSpecificationDateFetcher(): (
	specificationUrl: string,
) => Promise<Date | null> {
	const specificationUrlDateMap: Map<string, Date | null> = new Map();

	return async (specificationUrl) => {
		if (specificationUrlDateMap.has(specificationUrl)) {
			return specificationUrlDateMap.get(specificationUrl)!;
		}

		const response = await axios.get<string>(specificationUrl);
		const html = response.data;
		const $ = cheerio.load(html);
		const dateString = $('time.dt-updated').attr('datetime');
		const date = dateString ? new Date(Date.parse(dateString)) : null;

		specificationUrlDateMap.set(specificationUrl, date);

		return date;
	};
}

export async function getSpecifications(): Promise<CSSSpecification[]> {
	const fetchSpecificationDate = createSpecificationDateFetcher();

	const [descriptors, properties] = await Promise.all([
		axios.get<DescriptorsResponseBody>(URL_DESCRIPTORS).then((r) => r.data),
		axios.get<PropertiesResponseBody>(URL_PROPERTIES).then((r) => r.data),
	]);

	const specsByUrl = new Map<string, CSSSpecification>();

	for (const descriptor of descriptors) {
		const specificationUrl = getNormalizedSpecificationUrl(descriptor.URL);

		if (!specsByUrl.has(specificationUrl)) {
			specsByUrl.set(specificationUrl, {
				type: 'CSS_SPECIFICATION',
				level: descriptor.status,
				name: descriptor.specification,
				specificationUrl,
				lastUpdated: await fetchSpecificationDate(specificationUrl),
				relatedProperties: [],
				relatedDescriptors: [
					{
						name: descriptor.descriptor,
						uri: descriptor.URL,
					},
				],
			});
			continue;
		}

		const spec = specsByUrl.get(specificationUrl)!;
		spec.relatedDescriptors.push({
			name: descriptor.descriptor,
			uri: descriptor.URL,
		});
	}

	for (const property of properties) {
		const specificationUrl = getNormalizedSpecificationUrl(property.url);

		if (!specsByUrl.has(specificationUrl)) {
			specsByUrl.set(specificationUrl, {
				type: 'CSS_SPECIFICATION',
				level: property.status,
				name: property.title,
				specificationUrl,
				lastUpdated: await fetchSpecificationDate(specificationUrl),
				relatedProperties: [
					{
						name: property.property,
						uri: property.url,
					},
				],
				relatedDescriptors: [],
			});
			continue;
		}

		const spec = specsByUrl.get(specificationUrl)!;
		spec.relatedProperties.push({
			name: property.property,
			uri: property.url,
		});
	}

	return Array.from(specsByUrl.values());
}
