<script lang="ts">
	import { getLabelFromTag, type SpecificationTag } from '../../data';
	import Chip from '../Chip.svelte';

	type Theme = {
		background: string;
		foreground: string;
	};

	const TAG_THEME_MAP: Partial<{ [key in SpecificationTag]: Theme }> = {
		Accessibility: { background: '#005a9c', foreground: 'white' },
		CSS: { background: '#274de3', foreground: 'white' },
		ECMA262: { background: '#f7e018', foreground: 'black' },
		ECMA402: { background: '#f27b10', foreground: 'white' },
		HTML: { background: '#e54c20', foreground: 'white' },
		HTTP: { background: '#015a9d', foreground: 'white' },
		WoT: { background: '#005a9c', foreground: 'white' },
		XML: { background: '#015faf', foreground: 'white' },
	};

	const THEME_FALLBACK: Theme = {
		background: '#444',
		foreground: 'white',
	};

	const THEME_INACTIVATE: Theme = {
		background: 'white',
		foreground: 'currentColor',
	};

	export let active: boolean = true;
	export let tag: SpecificationTag;

	$: label = getLabelFromTag(tag);
	$: theme = active ? TAG_THEME_MAP[tag] ?? THEME_FALLBACK : THEME_INACTIVATE;
</script>

<Chip colorBackground={theme.background} colorForeground={theme.foreground}>
	{label}
</Chip>
