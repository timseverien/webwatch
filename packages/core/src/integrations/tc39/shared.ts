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

	if (stage === 4) {
		return {
			type: 'TC39_PROPOSAL',
			name,
			proposalUri: link.href,
			specificationUri,
			stage,
			// TODO: try to retrieve date
			lastUpdated: new Date(),
		};
	}

	return {
		type: 'TC39_PROPOSAL',
		name,
		proposalUri: link.href,
		specificationUri,
		stage,
		// TODO: try to retrieve date
		lastUpdated: new Date(),
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

function getSpecificationUriFromProposalUri(proposalUri: string): string {
	if (/github.com\/tc39\//.test(proposalUri)) {
		const url = new URL(proposalUri);
		const pathName = url.pathname.replace(/^\/tc39\//, '');
		return `https://tc39.es/${pathName}`;
	}

	return '';
}
