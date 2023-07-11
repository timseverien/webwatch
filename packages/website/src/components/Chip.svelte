<script lang="ts">
	import type { ColorTheme } from '../types/theme';

	export let color: ColorTheme = 'default';
	export let elevation: number = 1;

	$: background = `var(--color-${color})`;
	$: foreground = `var(--color-text-on-${color})`;
</script>

<!-- Line disabled because it can be a button -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class={`container mdc-elevation--z${elevation} mdc-elevation-transition`}
	style:--color-background={background}
	style:--color-foreground={foreground}
>
	<slot />
</div>

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
</style>
