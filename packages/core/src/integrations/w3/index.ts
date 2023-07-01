import axios from 'axios';
import { parse, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import localeEnUs from 'date-fns/locale/en-US';

// https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
// This list is ordered
const W3_SPECIFICATION_LEVELS = [
	// Working Draft
	'WD',
	// Candidate Recommendation
	'CR',
	// Proposed Recommendation
	'PR',
	// W3C Recommendation
	'REC',
] as const;

export type W3SpecificationLevel = (typeof W3_SPECIFICATION_LEVELS)[number];

export function getLevelsEqualOrGreaterThan(
	level: W3SpecificationLevel,
): W3SpecificationLevel[] {
	const index = W3_SPECIFICATION_LEVELS.indexOf(level);
	return W3_SPECIFICATION_LEVELS.slice(index);
}

export function isLevelEqualOrGreaterThan(
	level1: W3SpecificationLevel,
	level2: W3SpecificationLevel,
): boolean {
	const index1 = W3_SPECIFICATION_LEVELS.indexOf(level1);
	const index2 = W3_SPECIFICATION_LEVELS.indexOf(level2);
	return index1 >= index2;
}

export interface W3GenericSpecification {
	type: 'W3_SPECIFICATION';
	name: string;
	specificationUrl: string;
	level: W3SpecificationLevel;
	lastUpdated: Date | null;
}

export interface CssSpecification extends Omit<W3GenericSpecification, 'type'> {
	type: 'CSS_SPECIFICATION';
}

export interface DomSpecification extends Omit<W3GenericSpecification, 'type'> {
	type: 'DOM_SPECIFICATION';
}

export interface HtmlSpecification
	extends Omit<W3GenericSpecification, 'type'> {
	type: 'HTML_SPECIFICATION';
}

export interface JsonLdSpecification
	extends Omit<W3GenericSpecification, 'type'> {
	type: 'LSON_LD_SPECIFICATION';
}

export interface SvgSpecification extends Omit<W3GenericSpecification, 'type'> {
	type: 'SVG_SPECIFICATION';
}

export interface UriSpecification extends Omit<W3GenericSpecification, 'type'> {
	type: 'URI_SPECIFICATION';
}

export interface WaiAriaSpecification
	extends Omit<W3GenericSpecification, 'type'> {
	type: 'WAI_ARIA_SPECIFICATION';
}

export interface WasmSpecification
	extends Omit<W3GenericSpecification, 'type'> {
	type: 'WASM_SPECIFICATION';
}

export interface WebApiSpecification
	extends Omit<W3GenericSpecification, 'type'> {
	type: 'WEB_API_SPECIFICATION';
}

export type W3Specification =
	| W3GenericSpecification
	| CssSpecification
	| DomSpecification
	| HtmlSpecification
	| JsonLdSpecification
	| SvgSpecification
	| UriSpecification
	| WaiAriaSpecification
	| WasmSpecification
	| WebApiSpecification;

export interface W3SpecificationSerialized
	extends Omit<W3Specification, 'lastUpdated'> {
	lastUpdated: string | null;
}

interface SpecrefAliasItem {
	id: string;
	aliasOf: string;
}

interface SpecrefItem {
	id: string;
	title: string;
	href: string;
	date: string;
	status: string;
	authors: string[];
	publisher: string;
	edDraft?: string;
	deliveredBy?: [
		{
			shortname: string;
			url: string;
		},
	];
	versions?: string[];
}

type SpecrefResponseItem = SpecrefAliasItem | SpecrefItem;

function getSpecificationTypeByDelivery(name: string): W3Specification['type'] {
	switch (name) {
		case 'css':
			return 'CSS_SPECIFICATION';

		case 'svg':
			return 'SVG_SPECIFICATION';

		case 'uri':
			return 'URI_SPECIFICATION';

		case 'wai_about_s_eo':
		case 'wai_apa':
		case 'wai_aria':
		case 'wai_au':
		case 'wai_er':
		case 'wai_gl':
		case 'wai_indieui':
		case 'wai_pf':
		case 'wai_rd':
		case 'wai_ua':
			return 'WAI_ARIA_SPECIFICATION';

		case 'wasm':
			return 'WASM_SPECIFICATION';

		case 'webapi':
		case 'webcrypto':
		case 'webrtc':
		case 'webtransport':
			return 'WEB_API_SPECIFICATION';
	}

	return 'W3_SPECIFICATION';
}

function parseResponseItem(item: SpecrefItem, key: string): W3Specification {
	const date = parseDate(item.date);
	const name = item.title ?? key;

	if (item.date && !date) {
		console.warn('Unable to parse date for item', item);
	}

	const baseInfo: Omit<W3GenericSpecification, 'type'> = {
		lastUpdated: date,
		level: 'CR',
		name,
		specificationUrl: item.href,
	};

	if (item.deliveredBy?.some((i) => i.shortname === 'css')) {
		return {
			type: 'CSS_SPECIFICATION',
			...baseInfo,
			// TODO: add related descriptors and properties
		};
	}

	if (item.deliveredBy?.some((i) => i.shortname === 'dom')) {
		return {
			type: 'DOM_SPECIFICATION',
			...baseInfo,
			// TODO: add related descriptors and properties
		};
	}

	if (item.deliveredBy?.some((i) => i.shortname === 'dom')) {
		return {
			type: 'DOM_SPECIFICATION',
			...baseInfo,
			// TODO: add related descriptors and properties
		};
	}

	return {
		type: 'W3_SPECIFICATION',
		...baseInfo,
	};
}

function isSpecrefResponseItemAlias(item: any): item is SpecrefAliasItem {
	return !!item.aliasOf;
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
	const response = await axios.get<{
		[key: string]: SpecrefResponseItem | string;
	}>('https://api.specref.org/bibrefs');

	return (
		Object.entries(response.data)
			// Aliases refer to other items, so we can omit these
			// Additionally, some items are strings (dirty API data?) — let’s omit these too
			.filter((entry): entry is [string, SpecrefItem] => {
				const [, item] = entry;
				return typeof item !== 'string' && !isSpecrefResponseItemAlias(item);
			})
			.map<W3Specification>(([key, item]) => parseResponseItem(item, key))
	);
}

export function serialize(
	data: W3GenericSpecification[],
): W3SpecificationSerialized[] {
	return data.map<W3SpecificationSerialized>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
	}));
}

export function deserialize(
	data: W3SpecificationSerialized[],
): W3Specification[] {
	return data.map<W3Specification>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
	}));
}
