import {
	SpecificationLinkSourceVirtual,
	SpecificationLinkVirtual,
	SpecificationPublisherVirtual,
	SpecificationVersionVirtual,
	SpecificationVirtual,
} from '@spectakel/infrastructure/src/database/specification.js';
import { isEqual as isObjectEqual } from 'lodash';

export type SpecificationLinkSource = {
	id: string;
	url: string;
	feedUrl: string | null;
};

export type SpecificationLink = {
	id: string;
	name: string;
	url: string;
	source: SpecificationLinkSource;
};

export const SPECIFICATION_TAGS = [
	'Accessibility',
	'CSS',
	'Data',
	'HTML',
	'JavaScript',
	'JavaScript Internationalization API',
] as const;
export type SpecificationTag = (typeof SPECIFICATION_TAGS)[number];

export const SPECIFICATION_PUBLISHER_KEYS = ['TC39', 'W3'] as const;
export type SpecificationPublisherKey =
	(typeof SPECIFICATION_PUBLISHER_KEYS)[number];

export type SpecificationStatus = 'DRAFT' | 'PUBLISHED';

export type SpecificationPublisher = {
	id: string;
	key: SpecificationPublisherKey;
	name: string;
	url: string;
};

export type SpecificationElement = {
	id: string;
	name: string;
	// Published proposal
	url: string;
};

export type SpecificationVersion = {
	id: string;
	name: string;
	status: SpecificationStatus;
	url: string;
	revisionDate: Date;
	publishDate: Date | null;
	// New elements, e.g. proposals
	elements: SpecificationElement[];
};

export type Specification = {
	id: string;
	name: string;
	alternativeName: string | null;
	url: string;
	publisher: SpecificationPublisher;
	// Last scraping date
	updateDate: Date;
	tags: SpecificationTag[];
	versions: SpecificationVersion[];
	links: SpecificationLink[];
};

function isSpecificationNotVirtual(
	spec: Specification | SpecificationVirtual,
): spec is Specification {
	return typeof (spec as any).id === 'undefined';
}

function createVirtualSpecificationLinkSource(
	source: SpecificationLinkSource,
): SpecificationLinkSourceVirtual {
	return {
		feedUrl: source.feedUrl,
		url: source.url,
	};
}

function createVirtualSpecificationLink(
	link: SpecificationLink,
): SpecificationLinkVirtual {
	return {
		name: link.name,
		source: link.source,
		url: link.url,
	};
}

function createVirtualSpecificationPublisher(
	publisher: SpecificationPublisher,
): SpecificationPublisherVirtual {
	return {
		key: publisher.key,
		name: publisher.name,
		url: publisher.url,
	};
}

function createVirtualSpecificationVersion(
	version: SpecificationVersion,
): SpecificationVersionVirtual {
	return {
		name: version.name,
		publishDate: version.publishDate,
		revisionDate: version.revisionDate,
		status: version.status,
		url: version.url,
	};
}

function createVirtualSpecification(
	spec: Specification | SpecificationVirtual,
): SpecificationVirtual {
	if (!isSpecificationNotVirtual(spec)) {
		return spec;
	}

	return {
		alternativeName: spec.alternativeName,
		name: spec.name,
		updateDate: spec.updateDate,
		url: spec.url,
		tags: spec.tags,
		publisher: createVirtualSpecificationPublisher(spec.publisher),
		links: spec.links.map<SpecificationLinkVirtual>(
			createVirtualSpecificationLink,
		),
		versions: spec.versions.map<SpecificationVersionVirtual>(
			createVirtualSpecificationVersion,
		),
	};
}

export function isEqual(
	spec1: Specification | SpecificationVirtual,
	spec2: Specification | SpecificationVirtual | any,
): boolean {
	return isObjectEqual(
		createVirtualSpecification(spec1),
		createVirtualSpecification(spec2),
	);
}
