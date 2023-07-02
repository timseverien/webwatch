<script lang="ts" context="module">
	export interface Option<T extends string> {
		text: string;
		value: T;
	}
</script>

<script lang="ts">
	type T = $$Generic<string>;

	export let value: T;
	export let options: Option<T>[];
</script>

{#each options as option}
	<label>
		<input type="radio" bind:group={value} value={option.value} />
		{option.text}
	</label>
{/each}
