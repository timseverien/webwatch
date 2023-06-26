import axios from 'axios';
import {
	getTokens,
	selectByHeader,
	selectTables,
} from '../../../services/markdown.js';
import {
	Tc39Proposal,
	Tc39ProposalFinished,
	Tc39ProposalUnfinished,
} from '../index.js';
import {
	createProposalFromLink,
	getProposalLinksFromTable,
} from '../shared.js';

const client = axios.create({
	baseURL: 'https://raw.githubusercontent.com/tc39/proposals/main',
});

export async function getStage0Proposals(): Promise<Tc39ProposalUnfinished[]> {
	const response = await client.get<string>('/stage-0-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: Tc39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 0));
	}

	return results;
}

export async function getStage1Proposals(): Promise<Tc39ProposalUnfinished[]> {
	const response = await client.get<string>('/stage-1-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: Tc39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 1));
	}

	return results;
}

export async function getStage2Proposals(): Promise<Tc39ProposalUnfinished[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 2');
	const tables = selectTables(content);
	const results: Tc39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 2));
	}

	return results;
}

export async function getStage3Proposals(): Promise<Tc39Proposal[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 3');
	const tables = selectTables(content);
	const results: Tc39ProposalUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createProposalFromLink(link, 3));
	}

	return results;
}

export async function getStage4Proposals(): Promise<Tc39ProposalFinished[]> {
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
	(Tc39ProposalUnfinished | Tc39ProposalFinished)[]
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
