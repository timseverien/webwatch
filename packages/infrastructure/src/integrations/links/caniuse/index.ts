import { Specification } from '@spectakel/core/src/specification/index.js';
import data from 'caniuse-db/fulldata-json/data-2.0.json';
import {
	SpecificationLinkSourceVirtual,
	SpecificationLinkVirtual,
} from '../../../database/specification.js';
import { LinkIntegration } from '../shared.js';

const LINK_SOURCE: SpecificationLinkSourceVirtual = {
	url: 'https://caniuse.com',
	feedUrl: null,
};

export const INTEGRATION_CAN_I_USE: LinkIntegration = {
	async getLinksBySpecification(
		specification: Specification,
	): Promise<SpecificationLinkVirtual[]> {
		return Object.entries(data.data).reduce<SpecificationLinkVirtual[]>(
			(links, [key, entry]) => {
				if (entry.spec !== specification.url) {
					return links;
				}

				links.push({
					name: `Can I Use: ${entry.title}`,
					url: `https://caniuse.com/${key}`,
					source: LINK_SOURCE,
				});

				for (const link of entry.links) {
					links.push({
						name: link.title,
						url: link.url,
						source: LINK_SOURCE,
					});
				}

				return links;
			},
			[],
		);
	},
};
