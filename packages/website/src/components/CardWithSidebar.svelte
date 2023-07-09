<script>
	import Flow from './Flow.svelte';
</script>

<div class="container">
	<div class="layout">
		<Flow>
			<div>
				<slot name="header" />
			</div>
			<div>
				<slot />
			</div>
		</Flow>
		<div class="sidebar">
			<slot name="sidebar" />
		</div>
	</div>
</div>

<style>
	.container {
		border: 1px solid #ccc;
		border-radius: 0.25em;
		padding: 1em;
	}

	.layout {
		display: grid;
		grid-template-columns: 2fr 1fr;
	}
</style>
