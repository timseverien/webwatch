export function getHumanReadableUrl(url: string) {
	return url.replace(/^https?:\/\/(www\.)?/, '');
}
