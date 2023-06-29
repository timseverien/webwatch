import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import { enUS as localeEnUS } from 'date-fns/locale';
import { marked } from 'marked';
import { isTokenLink } from '../../services/markdown.js';
import {
	Tc39Proposal,
	Tc39ProposalFinished,
	Tc39ProposalFinishedStage,
	Tc39ProposalStage,
	Tc39ProposalUnfinished,
	Tc39ProposalUnfinishedStage,
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

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: Tc39ProposalUnfinishedStage,
): Promise<Tc39ProposalUnfinished>;

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: Tc39ProposalFinishedStage,
): Promise<Tc39ProposalFinished>;

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: Tc39ProposalStage,
): Promise<Tc39Proposal> {
	const name = link.text;
	const specificationUri = getSpecificationUriFromProposalUri(link.href);
	const lastUpdated = specificationUri
		? await getDateFromSpecificationUrl(specificationUri)
		: null;

	if (stage === 4) {
		return {
			type: 'TC39_PROPOSAL',
			name,
			proposalUri: link.href,
			specificationUri: specificationUri!,
			stage,
			lastUpdated: lastUpdated!,
		};
	}

	return {
		type: 'TC39_PROPOSAL',
		name,
		proposalUri: link.href,
		specificationUri,
		stage,
		lastUpdated,
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

function getSpecificationUriFromProposalUri(
	proposalUri: string,
): string | null {
	if (/github.com\/tc39\//.test(proposalUri)) {
		const url = new URL(proposalUri);
		const pathName = url.pathname.replace(/^\/tc39\//, '');
		return `https://tc39.es/${pathName}`;
	}

	return null;
}
