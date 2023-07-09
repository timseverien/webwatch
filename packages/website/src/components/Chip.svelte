<script lang="ts">
	export let colorBackground: string = 'white';
	export let colorForeground: string = 'black';
</script>

<!-- Line disabled because it can be a button -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="container mdc-elevation--z1"
	style:--color-background={colorBackground}
	style:--color-foreground={colorForeground}
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
