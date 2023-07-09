<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let colorBackground: string = 'black';
	export let colorForeground: string = 'white';
	export let element: 'div' | 'button' = 'div';

	const dispatch = createEventDispatcher<{ click: void }>();
</script>

<!-- Line disabled because it can be a button -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={element}
	class="container"
	style:--color-background={colorBackground}
	style:--color-foreground={colorForeground}
	on:click={() => dispatch('click')}
>
	<slot />
</svelte:element>

<style>
	.container {
		display: inline-block;
		border: 0;
		border-radius: 0.75rem;
		background-color: var(--color-background);
		color: var(--color-foreground);
		padding-inline: 0.75em;
		padding-block: 0.25em;
		font-size: 0.75rem;
	}

	button.container:hover {
		background-color: transparent;
		outline: currentColor solid 0.125em;
		color: inherit;
	}
</style>
