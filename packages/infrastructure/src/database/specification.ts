import type {
	Specification,
	SpecificationLink,
	SpecificationLinkSource,
	SpecificationPublisher,
	SpecificationTag,
	SpecificationVersion,
} from '@spectakel/core/src/specification';
import {
	SPECIFICATION_PUBLISHER_KEYS,
	SPECIFICATION_TAGS,
	SpecificationPublisherKey,
} from '@spectakel/core/src/specification/index.js';
import { parse } from 'date-fns';
import { DatabaseClient } from './index.js';

export type SpecificationLinkSourceVirtual = Omit<
	SpecificationLinkSource,
	'id'
>;
export type SpecificationLinkVirtual = Omit<
	SpecificationLink,
	'id' | 'source' | 'specification'
> & { source: SpecificationLinkSource | SpecificationLinkSourceVirtual };

export type SpecificationPublisherVirtual = Omit<
	SpecificationPublisher,
	'id' | 'specification'
>;

export type SpecificationVersionVirtual = Omit<
	SpecificationVersion,
	'id' | 'elements' | 'specifications'
>;

export type SpecificationVirtual = Omit<
	Specification,
	'id' | 'publisher' | 'versions' | 'links'
> & {
	publisher: SpecificationPublisher | SpecificationPublisherVirtual;
	versions: (SpecificationVersion | SpecificationVersionVirtual)[];
	links: (SpecificationLink | SpecificationLinkVirtual)[];
};

export function isSpecificationVersionUrl(url: string) {
	return /\/TR\/[0-9]{4}\/[^\/]+[0-9]{8}\/?$/.test(url);
}

export function getSpecificationVersionDateFromUrl(url: string): Date {
	const { date } =
		/\/TR\/[0-9]{4}\/[^\/]+(?<date>[0-9]{8})\/?$/.exec(url)?.groups ?? {};

	return parse(date, 'yyyyMMdd', new Date());
}

export function createSpecificationTagsFromResult(
	result: string[],
): SpecificationTag[] {
	const tags = SPECIFICATION_TAGS.filter((t) => result.includes(t));

	if (tags.length !== result.length) {
		console.log('Not all tags could be resolved:', {
			database: result,
			tags: SPECIFICATION_TAGS,
		});
	}

	return tags;
}

export function createSpecificationPublisherFromResult(
	result: any,
): SpecificationPublisher {
	return {
		...result,
		key: SPECIFICATION_PUBLISHER_KEYS.find((k) => k === result.key)!,
	};
}

export function createSpecificationFromResult(result: any): Specification {
	return {
		...result,
		publisher: createSpecificationPublisherFromResult(result.publisher),
		tags: createSpecificationTagsFromResult(result.tags),
	};
}

export function getLinks(client: DatabaseClient) {
	return client.specificationLink.findMany();
}

export function getLinkSources(client: DatabaseClient) {
	return client.specificationLinkSource.findMany();
}

export function getPublishers(client: DatabaseClient) {
	return client.specificationPublisher.findMany();
}

export function getPublisherByKey(
	client: DatabaseClient,
	key: SpecificationPublisherKey,
) {
	return client.specificationPublisher.findFirstOrThrow({
		where: {
			key,
		},
	});
}

export async function getSpecifications(client: DatabaseClient) {
	return client.specification.findMany();
}

export async function getSpecificationsByPublisher(
	client: DatabaseClient,
	publisherId: string,
) {
	return client.specification.findMany({
		include: {
			publisher: true,
			links: {
				include: {
					source: true,
				},
			},
			versions: {
				include: {
					elements: true,
				},
			},
		},
		where: {
			publisherId,
		},
	});
}

export function storeNewPublisher(
	client: DatabaseClient,
	publisher: SpecificationPublisherVirtual,
) {
	return client.specificationPublisher.create({
		data: publisher,
	});
}

export function storeNewSpecification(
	client: DatabaseClient,
	specification: SpecificationVirtual,
) {
	return client.specification.create({
		data: {
			...specification,
			publisher: {
				connect: {
					key: specification.publisher.key,
				},
			},
			versions: {
				connectOrCreate: specification.versions.map((version) => ({
					create: {
						...version,
						elements: undefined,
					},
					where: {
						url: version.url,
					},
				})),
			},
			links: {
				connectOrCreate: specification.links.map((link) => ({
					create: {
						...link,
						source: {
							connectOrCreate: {
								create: link.source,
								where: {
									url: link.source.url,
								},
							},
						},
					},
					where: {
						url: link.url,
					},
				})),
			},
		},
	});
}
export function storeNewSpecificationVersion(
	client: DatabaseClient,
	specificationVersion: SpecificationVersionVirtual,
) {
	return client.specificationVersion.create({
		data: specificationVersion,
	});
}
