import { Specification } from '@spectakel/core/src/specification/index.js';
import type { Item } from 'rss-parser';
import { getProposalUrlFromSpecificationUrl } from '../../specifications/tc39/shared.js';
import { LinkIntegration, createLinkIntegrationFromFeed } from '../shared.js';

async function isRssItemAboutSpecification(
	specification: Specification,
	post: Item,
): Promise<boolean> {
	if (specification.publisher.key === 'TC39') {
		return false;
	}

	const proposalUrl = getProposalUrlFromSpecificationUrl(specification.url);

	return (
		(post.content?.includes(proposalUrl) ||
			post.content?.includes(specification.url) ||
			post.summary?.includes(proposalUrl) ||
			post.summary?.includes(specification.url)) ??
		false
	);
}

export const INTEGRATION_2ALITY: LinkIntegration =
	createLinkIntegrationFromFeed(
		'https://2ality.com',
		'https://2ality.com/feeds/posts.atom',
		isRssItemAboutSpecification,
	);
