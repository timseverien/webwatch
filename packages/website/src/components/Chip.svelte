<script lang="ts">
	export let colorBackground: string = 'black';
	export let colorForeground: string = 'white';
</script>

<div
	class="container"
	style:--color-background={colorBackground}
	style:--color-foreground={colorForeground}
>
	<slot />
</div>

<style>
	.container {
		display: block;
		border-radius: 0.75rem;
		background-color: var(--color-background);
		color: var(--color-foreground);
		padding-inline: 0.75em;
		padding-block: 0.25em;
		font-size: 0.75rem;
	}
</style>
