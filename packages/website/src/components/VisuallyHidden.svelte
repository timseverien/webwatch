<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let element: keyof SvelteHTMLElements = 'div';
</script>

<svelte:element this={element} class="container">
	<slot />
</svelte:element>

<style>
	.container {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
</style>
