import { Specification } from '@spectakel/core/src/specification/index.js';
import Parser, { Item } from 'rss-parser';
import { SpecificationLinkVirtual } from '../../database/specification.js';

export type LinkIntegration = {
	getLinksBySpecification(
		specification: Specification,
	): Promise<SpecificationLinkVirtual[]>;
};

export async function parseRssFeed(feedUrl: string) {
	const parser = new Parser();
	return parser.parseURL(feedUrl);
}

export function createLinkIntegrationFromFeed(
	sourceUrl: string,
	feedUrl: string,
	isRssItemAboutSpecification: (
		specification: Specification,
		item: Item,
	) => Promise<boolean> | boolean,
): LinkIntegration {
	return {
		async getLinksBySpecification(
			specification: Specification,
		): Promise<SpecificationLinkVirtual[]> {
			const feed = await parseRssFeed(feedUrl);
			const links: SpecificationLinkVirtual[] = [];

			for (const item of feed.items) {
				if (!(await isRssItemAboutSpecification(specification, item))) {
					continue;
				}

				if (!item.title || !item.link) {
					console.log(
						'Item is potential match, but is missing title or link',
						item,
					);
					continue;
				}

				links.push({
					name: item.title,
					url: item.link,
					source: {
						url: sourceUrl,
						feedUrl: feedUrl,
					},
				});
			}

			return links;
		},
	};
}
