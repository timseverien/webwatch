<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let element: keyof SvelteHTMLElements = 'div';
	export let direction: 'BLOCK' | 'INLINE' = 'BLOCK';
	export let size: number = 1;
</script>

<svelte:element
	this={element}
	class="flow"
	class:flow--block={direction === 'BLOCK'}
	class:flow--inline={direction === 'INLINE'}
	style:--flow-spacing={`${size}em`}
>
	<slot />
</svelte:element>

<style>
	.flow {
		display: flex;
		gap: var(--flow-spacing, 1em);
	}
	.flow--block {
		flex-flow: column wrap;
	}
	.flow--inline {
		flex-flow: row wrap;
	}
</style>
