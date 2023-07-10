<script lang="ts">
	type Size = 'default' | 'wide';
	export let size: Size = 'default';
</script>

<div class="container" class:container--wide={size === 'wide'}>
	<slot />
</div>

<style>
	.container {
		max-width: 60ch;
	}

	.container--wide {
		max-width: 90ch;
	}
</style>
