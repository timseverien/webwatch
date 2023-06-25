export function getRepositoryReadmeUri(repositoryUri: string): string {
	const url = new URL(repositoryUri);

	url.hostname = 'raw.githubusercontent.com';
	url.pathname = `${url.pathname}/master/README.md`;

	return url.toString();
}
