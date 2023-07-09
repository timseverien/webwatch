import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import { enUS as localeEnUS } from 'date-fns/locale';
import { marked } from 'marked';
import { isTokenLink } from '../../services/markdown.js';
import {
	Tc39Specification,
	Tc39SpecificationFinished,
	Tc39SpecificationStage,
	Tc39SpecificationTag,
	Tc39SpecificationUnfinished,
	Tc39SpecificationUnfinishedStage,
} from './index.js';

async function getDateFromSpecificationUrl(url: string): Promise<Date | null> {
	try {
		const result = await axios.get(url);
		const $ = cheerio.load(result.data);

		const version = $('#spec-container .version').text();
		if (!version) {
			return null;
		}

		const dateString = version.substring(version.lastIndexOf('/') + 1).trim();
		if (!dateString) {
			return null;
		}

		return parse(dateString, 'MMMM d, yyyy', new Date(), {
			locale: localeEnUS,
		});
	} catch {}

	return null;
}

export async function createSpecificationFromLink(
	link: marked.Tokens.Link,
	info: {
		stage: Tc39SpecificationUnfinishedStage;
		tags: Tc39SpecificationTag[];
	},
): Promise<Tc39SpecificationUnfinished>;

export async function createSpecificationFromLink(
	link: marked.Tokens.Link,
	info: {
		stage: 4;
		tags: Tc39SpecificationTag[];
	},
): Promise<Tc39SpecificationFinished>;

export async function createSpecificationFromLink(
	link: marked.Tokens.Link,
	info: {
		stage: Tc39SpecificationStage;
		tags: Tc39SpecificationTag[];
	},
): Promise<Tc39Specification> {
	const name = link.text;
	const specificationUrl = getSpecificationUrlFromProposalUrl(link.href);
	const lastUpdated = specificationUrl
		? await getDateFromSpecificationUrl(specificationUrl)
		: null;

	if (info.stage === 4) {
		return {
			type: 'TC39_SPECIFICATION',
			name,
			proposalUrl: link.href,
			specificationUrl: specificationUrl!,
			stage: info.stage,
			lastUpdated: lastUpdated!,
			tags: info.tags,
		};
	}

	return {
		type: 'TC39_SPECIFICATION',
		name,
		proposalUrl: link.href,
		specificationUrl,
		stage: info.stage,
		lastUpdated,
		tags: info.tags,
	};
}

export function getProposalLinksFromTable(
	tables: marked.Tokens.Table[],
): marked.Tokens.Link[] {
	const links: marked.Tokens.Link[] = [];

	for (const table of tables) {
		if (table.header[0].text !== 'Proposal') continue;

		for (const row of table.rows) {
			const link = row[0].tokens.find(isTokenLink);
			if (!link) continue;
			links.push(link);
		}
	}

	return links;
}

function getSpecificationUrlFromProposalUrl(
	proposalUrl: string,
): string | null {
	if (/github.com\/tc39\//.test(proposalUrl)) {
		const url = new URL(proposalUrl);
		const pathName = url.pathname.replace(/^\/tc39\//, '');
		return `https://tc39.es/${pathName}`;
	}

	return null;
}
