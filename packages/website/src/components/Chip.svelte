<script lang="ts">
	import type { ColorTheme } from '../types/theme';

	export let color: ColorTheme = 'surface';
	export let elevation: number = 1;

	$: background = `var(--theme-${color ?? 'surface'})`;
	$: foreground = `var(--theme-on-${color ?? 'surface'})`;
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
		padding-inline: 0.75em;
		padding-block: 0.25em;

		background-color: var(--color-background);
		border: 0;
		border-radius: 0.75rem;

		color: var(--color-foreground);
		font-size: 0.75rem;
	}
</style>
