import slugify from 'slugify';
import {
	SPECIFICATION_TAG_LABEL_MAP,
	getSpecificationTags,
	type SpecificationTag,
} from './data';

const SLUG_TAG_MAP = new Map(
	getSpecificationTags().map((tag) => [getTagSlug(tag), tag]),
);

function getTagSlug(tag: SpecificationTag): string {
	return slugify(tag).toLowerCase();
}

export function serializeTagList(tags: SpecificationTag[]): string {
	return Array.from(tags)
		.sort((a, b) => a.localeCompare(b))
		.map((tag) => getTagSlug(tag))
		.join(',');
}

export function deserializeTagList(tags: string): SpecificationTag[] {
	return tags
		.split(',')
		.map((slug) => SLUG_TAG_MAP.get(slug)!)
		.filter((tag): tag is SpecificationTag =>
			Object.keys(SPECIFICATION_TAG_LABEL_MAP).includes(tag),
		);
}
