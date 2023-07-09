<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		getLabelFromTag,
		getThemeColorMapFromTag,
		type SpecificationTag,
	} from '../../data';
	import Chip from '../Chip.svelte';

	export let tag: SpecificationTag;
	export let active: boolean = false;

	const dispatch = createEventDispatcher<{ click: void }>();

	$: label = getLabelFromTag(tag);
	$: theme = active
		? getThemeColorMapFromTag(tag)
		: {
				background: 'transparent',
				foreground: 'currentColor',
		  };
</script>

<Chip
	element="button"
	colorBackground={theme.background}
	colorForeground={theme.foreground}
	on:click={() => dispatch('click')}
>
	{label}
</Chip>
