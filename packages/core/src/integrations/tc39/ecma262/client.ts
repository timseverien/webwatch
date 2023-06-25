import axios from 'axios';
import { marked } from 'marked';
import {
	getTokens,
	isTokenLink,
	selectByHeader,
	selectTables,
} from '../../../services/markdown.js';
import {
	TC39Proposal,
	TC39ProposalFinished,
	TC39ProposalFinishedStage,
	TC39ProposalStage,
	TC39ProposalUnfinished,
	TC39ProposalUnfinishedStage,
} from '../index.js';

const client = axios.create({
	baseURL: 'https://raw.githubusercontent.com/tc39/proposals/main',
});

function getSpecificationUriFromProposalUri(proposalUri: string): string {
	const url = new URL(proposalUri);
	const pathName = url.pathname.replace(/^\/tc39\//, '');
	return `https://tc39.es/${pathName}`;
}

function getProposalLinksFromTable(
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

async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalUnfinishedStage,
): Promise<TC39ProposalUnfinished>;

async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalFinishedStage,
): Promise<TC39ProposalFinished>;

async function createProposalFromLink(
	link: marked.Tokens.Link,
	stage: TC39ProposalStage,
): Promise<TC39Proposal> {
	const specificationUri = getSpecificationUriFromProposalUri(link.href);
	const name = link.text.replace(/^`(.+)`$/, '$1');

	if (stage === 4) {
		return {
			type: 'PROPOSAL_FINISHED',
			name,
			proposalUri: link.href,
			specificationUri,
			stage,
		};
	}

	return {
		type: 'PROPOSAL_UNFINISHED',
		name,
		proposalUri: link.href,
		specificationUri,
		stage,
	};
}

export async function getStage0Proposals(): Promise<TC39ProposalUnfinished[]> {
	const response = await client.get<string>('/stage-0-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: TC39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 0));
	}

	return results;
}

export async function getStage1Proposals(): Promise<TC39ProposalUnfinished[]> {
	const response = await client.get<string>('/stage-1-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: TC39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 1));
	}

	return results;
}

export async function getStage2Proposals(): Promise<TC39ProposalUnfinished[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 2');
	const tables = selectTables(content);
	const results: TC39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 2));
	}

	return results;
}

export async function getStage3Proposals(): Promise<TC39Proposal[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 3');
	const tables = selectTables(content);
	const results: TC39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 3));
	}

	return results;
}

export async function getStage4Proposals(): Promise<TC39ProposalFinished[]> {
	const response = await client.get<string>('/finished-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);

	return Promise.all(
		getProposalLinksFromTable(tables).map((link) =>
			createProposalFromLink(link, 4),
		),
	);
}

export async function getProposals(): Promise<
	(TC39ProposalUnfinished | TC39ProposalFinished)[]
> {
	const proposals = await Promise.all([
		getStage0Proposals(),
		getStage1Proposals(),
		getStage2Proposals(),
		getStage3Proposals(),
		getStage4Proposals(),
	]);

	return proposals.flat();
}
