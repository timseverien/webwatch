import { Specification } from '../specifications/index.js';
import { INTEGRATION_2ALITY } from './2ality/index.js';
import { INTEGRATION_CAN_I_USE } from './caniuse/index.js';

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
