import { marked } from 'marked';

export function getTokens(markdown: string): marked.TokensList {
	return marked.lexer(markdown, {
		gfm: true,
	});
}

export function isTokenHeading(
	token: marked.Token,
): token is marked.Tokens.Heading {
	return token.type === 'heading';
}

export function isTokenLink(token: marked.Token): token is marked.Tokens.Link {
	return token.type === 'link';
}

export function selectByHeader(
	tokens: marked.Token[],
	heading: string,
): marked.Token[] {
	const tokenStart = tokens.find(
		(t): t is marked.Tokens.Heading =>
			isTokenHeading(t) && t.text.trim() === heading,
	);

	if (!tokenStart) {
		return [];
	}

	const tokenStartIndex = tokens.indexOf(tokenStart);
	const tokenEndIndex = tokens.findIndex(
		(t, i): t is marked.Tokens.Heading =>
			isTokenHeading(t) && t.depth === tokenStart.depth && i > tokenStartIndex,
	);

	return tokens.slice(tokenStartIndex, tokenEndIndex ?? undefined);
}

export function selectTables(tokens: marked.Token[]): marked.Tokens.Table[] {
	return tokens.filter((t): t is marked.Tokens.Table => t.type === 'table');
}
