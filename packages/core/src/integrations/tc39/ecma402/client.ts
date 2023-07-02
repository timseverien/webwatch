import axios from 'axios';
import {
	getTokens,
	selectByHeader,
	selectTables,
} from '../../../services/markdown.js';
import {
	Tc39Specification,
	Tc39SpecificationFinished,
	Tc39SpecificationUnfinished,
} from '../index.js';
import {
	createSpecificationFromLink,
	getProposalLinksFromTable,
} from '../shared.js';

const client = axios.create({
	baseURL: 'https://raw.githubusercontent.com/tc39/proposals/main/ecma402/',
});

export async function getStage0Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/stage-0-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createSpecificationFromLink(link, 0));
	}

	return results;
}

export async function getStage1Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 1');
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createSpecificationFromLink(link, 1));
	}

	return results;
}

export async function getStage2Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 2');
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createSpecificationFromLink(link, 2));
	}

	return results;
}

export async function getStage3Specifications(): Promise<Tc39Specification[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 3');
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(await createSpecificationFromLink(link, 3));
	}

	return results;
}

export async function getStage4Specifications(): Promise<
	Tc39SpecificationFinished[]
> {
	const response = await client.get<string>('/finished-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);

	return Promise.all(
		getProposalLinksFromTable(tables).map((link) =>
			createSpecificationFromLink(link, 4),
		),
	);
}

export async function getSpecifications(): Promise<
	(Tc39SpecificationUnfinished | Tc39SpecificationFinished)[]
> {
	const specifications = await Promise.all([
		getStage0Specifications(),
		getStage1Specifications(),
		getStage2Specifications(),
		getStage3Specifications(),
		getStage4Specifications(),
	]);

	return specifications.flat();
}
