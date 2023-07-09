<script lang="ts">
	import VisuallyHidden from './VisuallyHidden.svelte';

	export let hidden: boolean = true;
</script>

{#if hidden}
	<VisuallyHidden>
		<slot />
	</VisuallyHidden>
{:else}
	<slot />
{/if}
