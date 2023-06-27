import axios from 'axios';
import { parse, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import localeEnUs from 'date-fns/locale/en-US';

// https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
export type W3SpecificationLevel = 'WD' | 'CR' | 'PR' | 'REC';

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

export type W3Specification = W3GenericSpecification | CssSpecification;

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
