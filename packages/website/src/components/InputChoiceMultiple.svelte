<script lang="ts">
	import type { Option } from './InputChoice.svelte';

	type T = $$Generic<string>;

	export let value: T[];
	export let options: Option<T>[];
</script>

{#each options as option}
	<label>
		<input type="checkbox" bind:group={value} value={option.value} />
		{option.text}
	</label>
{/each}
