<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ColorTheme } from '../types/theme';

	export let element: 'a' | 'button' = 'button';
	export let color: ColorTheme = 'primary';
	export let variant: 'default' | 'text' = 'default';

	const dispatch = createEventDispatcher<{ click: void }>();
</script>

<!-- Element doesn’t need ARIA role because element is either "a" or "button" -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={element}
	class="button"
	class:button--text={variant === 'text'}
	style:--button-foreground={`var(--theme-on-${color})`}
	style:--button-background={`var(--theme-${color})`}
	on:click={() => dispatch('click')}
>
	<slot />
</svelte:element>

<style>
	.button {
		--button-padding-block: 0.25em;
		--button-padding-inline: 0.5em;

		display: inline-block;
		padding-block: var(--button-padding-block);
		padding-inline: var(--button-padding-inline);

		background-color: var(--button-background);
		border: 0;
		border-radius: 0.25em;

		color: var(--button-foreground);
	}

	.button--text {
		--button-background: transparent;
		--button-foreground: inherit;
		--button-padding-block: 0;
		--button-padding-inline: 0;

		display: inline;
	}
</style>
