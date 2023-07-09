<script>
	import Flow from './Flow.svelte';
</script>

<div class="container mdc-elevation--z1">
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
		background-color: #fff;
		border-radius: 0.25em;
		padding: 1em;
	}
</style>
