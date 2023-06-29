export function getRepositoryReadmeUrl(repositoryUrl: string): string {
	const url = new URL(repositoryUrl);

	url.hostname = 'raw.githubusercontent.com';
	url.pathname = `${url.pathname}/master/README.md`;

	return url.toString();
}
