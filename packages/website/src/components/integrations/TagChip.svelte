<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getLabelFromTag, type SpecificationTag } from '../../data';
	import Chip from '../Chip.svelte';

	type Theme = {
		background: string;
		foreground: string;
	};

	const TAG_THEME_MAP: Partial<{ [key in SpecificationTag]: Theme }> = {
		Accessibility: { background: '#005a9c', foreground: 'white' },
		CSS: { background: '#274de3', foreground: 'white' },
		DOM: { background: 'black', foreground: 'white' },
		ECMA262: { background: '#f7e018', foreground: 'black' },
		ECMA402: { background: '#f27b10', foreground: 'white' },
		HTML: { background: '#e54c20', foreground: 'white' },
		HTTP: { background: '#015a9d', foreground: 'white' },
		WoT: { background: '#005a9c', foreground: 'white' },
		XML: { background: '#015faf', foreground: 'white' },
	};

	const FALLBACK_THEME: Theme = {
		background: 'transparent',
		foreground: 'currentColor',
	};

	export let active: boolean = true;
	export let element: 'button' | 'div' = 'div';
	export let tag: SpecificationTag;

	const dispatch = createEventDispatcher<{ click: void }>();

	$: label = getLabelFromTag(tag);
	$: theme = active ? TAG_THEME_MAP[tag] ?? FALLBACK_THEME : FALLBACK_THEME;
</script>

<Chip
	{element}
	colorBackground={theme.background}
	colorForeground={theme.foreground}
	on:click={() => dispatch('click')}
>
	{label}
</Chip>
