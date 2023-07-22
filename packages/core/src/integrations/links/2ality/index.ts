import type { Item } from 'rss-parser';
import type { LinkBlog, LinkIntegration } from '../../../link/index.js';
import { Specification } from '../../../specification/index.js';
import { getProposalUrlFromSpecificationUrl } from '../../specifications/tc39/shared.js';
import { createBlogIntegration } from '../shared.js';

async function isRssItemAboutSpecification(
	specification: Specification,
	post: Item,
): Promise<boolean> {
	if (specification.type !== 'TC39_SPECIFICATION') {
		return false;
	}

	const proposalUrl = getProposalUrlFromSpecificationUrl(
		specification.specificationUrl,
	);

	return (
		(post.content?.includes(proposalUrl) ||
			post.content?.includes(specification.specificationUrl) ||
			post.summary?.includes(proposalUrl) ||
			post.summary?.includes(specification.specificationUrl)) ??
		false
	);
}

export const INTEGRATION_2ALITY: LinkIntegration<LinkBlog> =
	createBlogIntegration(
		'https://2ality.com/feeds/posts.atom',
		isRssItemAboutSpecification,
	);
