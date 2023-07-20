export function getHumanReadableDomain(url: string) {
	return getHumanReadableUrl(url).replace(/\/.+$/, '');
}

export function getHumanReadableUrl(url: string) {
	return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\?.+$/, '');
}
