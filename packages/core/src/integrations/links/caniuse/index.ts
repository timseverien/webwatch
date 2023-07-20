import data from 'caniuse-db/fulldata-json/data-2.0.json';
import { Specification } from '../../specifications/index.js';
import type { LinkAboutSpecification, LinkIntegration } from '../index.js';

export const INTEGRATION_CAN_I_USE: LinkIntegration<LinkAboutSpecification> = {
	async getLinksBySpecification(
		specification: Specification,
	): Promise<LinkAboutSpecification[]> {
		return Object.entries(data.data).reduce<LinkAboutSpecification[]>(
			(links, [key, entry]) => {
				if (entry.spec !== specification.specificationUrl) {
					return links;
				}

				links.push({
					type: 'CAN_I_USE',
					title: `Can I Use: ${entry.title}`,
					url: `https://caniuse.com/${key}`,
				});

				for (const link of entry.links) {
					links.push({
						type: 'OTHER',
						title: link.title,
						url: link.url,
					});
				}

				return links;
			},
			[],
		);
	},
};
