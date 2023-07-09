<script lang="ts">
	import ConditionallyVisuallyHidden from './ConditionallyVisuallyHidden.svelte';

	type T = $$Generic<string>;

	export let value: T[];
	export let options: T[];
	export let showInput: boolean = false;
</script>

{#each options as option (option)}
	<label>
		<ConditionallyVisuallyHidden hidden={!showInput}>
			<input type="checkbox" bind:group={value} value={option} />
		</ConditionallyVisuallyHidden>
		<slot {option} isSelected={value.includes(option)} />
	</label>
{/each}
