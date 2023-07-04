<script>
	import Flow from './Flow.svelte';
</script>

<div class="container">
	<Flow>
		<div>
			<slot name="header" />
		</div>
		<div>
			<slot />
		</div>
	</Flow>
</div>

<style>
	.container {
		border: 1px solid #ccc;
		border-radius: 0.25em;
		padding: 1em;
	}
</style>
