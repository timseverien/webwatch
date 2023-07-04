<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let element: keyof SvelteHTMLElements = 'div';
	export let direction: 'BLOCK' | 'INLINE' = 'BLOCK';
	export let size: number = 1;
	export let align: 'END' | 'SPACE-BETWEEN' | 'START' | null = null;
	export let justify: 'END' | 'SPACE-BETWEEN' | 'START' | null = null;
</script>

<svelte:element
	this={element}
	class="flow"
	class:flow--direction-block={direction === 'BLOCK'}
	class:flow--direction-inline={direction === 'INLINE'}
	class:flow--align-end={align === 'END'}
	class:flow--align-space-between={align === 'SPACE-BETWEEN'}
	class:flow--align-start={align === 'START'}
	class:flow--justify-end={justify === 'END'}
	class:flow--justify-space-between={justify === 'SPACE-BETWEEN'}
	class:flow--justify-start={justify === 'START'}
	style:--flow-spacing={`${size}em`}
>
	<slot />
</svelte:element>

<style>
	.flow {
		display: flex;
		gap: var(--flow-spacing, 1em);
	}
	.flow--direction-block {
		flex-flow: column wrap;
	}
	.flow--direction-inline {
		flex-flow: row wrap;
	}

	.flow--align-start {
		align-content: flex-start;
	}
	.flow--align-end {
		align-content: flex-end;
	}
	.flow--align-space-between {
		align-content: space-between;
	}

	.flow--justify-start {
		justify-content: flex-start;
	}
	.flow--justify-end {
		justify-content: flex-end;
	}
	.flow--justify-space-between {
		justify-content: space-between;
	}
</style>
