<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ColorTheme } from '../types/theme';
	import Flow from './Flow.svelte';

	const dispatcher = createEventDispatcher<{ click: MouseEvent }>();

	export let color: ColorTheme = 'surface';

	$: background = `var(--theme-${color ?? 'surface'})`;
	$: foreground = `var(--theme-on-${color ?? 'surface'})`;
</script>

<!-- This click handler is to handle primary links in this card -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="container mdc-elevation--z1"
	style:--color-background={background}
	style:--color-foreground={foreground}
	on:click={(event) => dispatcher('click', event)}
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
