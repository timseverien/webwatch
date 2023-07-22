import { INTEGRATION_2ALITY } from '../integrations/links/2ality/index.js';
import { INTEGRATION_CAN_I_USE } from '../integrations/links/caniuse/index.js';
import { Specification } from '../specification/index.js';

export type LinkBlog = {
	type: 'BLOG';
	publishDate: Date;
	title: string;
	url: string;
};

export type LinkCanIUse = {
	type: 'CAN_I_USE';
	title: string;
	url: string;
};

export type LinkOther = {
	type: 'OTHER';
	title: string;
	url: string;
};

export type LinkAboutSpecification = LinkBlog | LinkCanIUse | LinkOther;

export interface LinkIntegration<
	T extends LinkAboutSpecification = LinkAboutSpecification,
> {
	getLinksBySpecification(specification: Specification): Promise<T[]>;
}

export const LINK_INTEGRATIONS: LinkIntegration[] = [
	INTEGRATION_2ALITY,
	INTEGRATION_CAN_I_USE,
];
