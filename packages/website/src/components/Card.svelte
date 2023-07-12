<script lang="ts">
	import type { ColorTheme } from '../types/theme';
	import Flow from './Flow.svelte';

	export let color: ColorTheme = 'surface';

	$: background = `var(--theme-${color ?? 'surface'})`;
	$: foreground = `var(--theme-on-${color ?? 'surface'})`;
</script>

<div
	class="container mdc-elevation--z1"
	style:--color-background={background}
	style:--color-foreground={foreground}
>
	<Flow>
		{#if $$slots.header}
			<div>
				<slot name="header" />
			</div>
		{/if}

		<div>
			<slot />
		</div>

		{#if $$slots.footer}
			<div>
				<slot name="footer" />
			</div>
		{/if}
	</Flow>
</div>

<style>
	.container {
		padding: 1em;

		background-color: var(--color-background);
		border-radius: 0.25em;

		color: var(--color-foreground);
	}
</style>
