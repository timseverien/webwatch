import { marked } from 'marked';
import { isTokenLink } from '../../services/markdown.js';
import {
	TC39Proposal,
	TC39ProposalFinished,
	TC39ProposalFinishedStage,
	TC39ProposalStage,
	TC39ProposalUnfinished,
	TC39ProposalUnfinishedStage,
} from './index.js';

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalUnfinishedStage,
): Promise<TC39ProposalUnfinished>;

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalFinishedStage,
): Promise<TC39ProposalFinished>;

export async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalStage,
): Promise<TC39Proposal> {
	const name = link.text;
	const specificationUri = getSpecificationUriFromProposalUri(link.href);

	if (stage === 4) {
		return {
			type: 'TC39_PROPOSAL_FINISHED',
			name,
			proposalUri: link.href,
			specificationUri,
			stage,
		};
	}

	return {
		type: 'TC39_PROPOSAL_UNFINISHED',
		name,
		proposalUri: link.href,
		specificationUri,
		stage,
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
	const url = new URL(proposalUri);
	const pathName = url.pathname.replace(/^\/tc39\//, '');
	return `https://tc39.es/${pathName}`;
}
