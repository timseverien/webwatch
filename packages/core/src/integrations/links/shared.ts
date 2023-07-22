import Parser, { Item } from 'rss-parser';
import { LinkBlog, LinkIntegration } from '../../link/index.js';
import { Specification } from '../../specification/index.js';

export async function parseRssFeed(feedUrl: string) {
	const parser = new Parser();
	return parser.parseURL(feedUrl);
}

export function createBlogIntegration(
	feedUrl: string,
	isRssItemAboutSpecification: (
		specification: Specification,
		item: Item,
	) => Promise<boolean> | boolean,
): LinkIntegration<LinkBlog> {
	return {
		async getLinksBySpecification(
			specification: Specification,
		): Promise<LinkBlog[]> {
			const feed = await parseRssFeed(feedUrl);
			const links: LinkBlog[] = [];

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
					type: 'BLOG',
					publishDate: new Date(item.isoDate ?? 0),
					title: item.title,
					url: item.link,
				});
			}

			return links;
		},
	};
}
