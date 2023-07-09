<script lang="ts">
	import InputChoiceMultipleSlotted from './InputChoiceMultipleSlotted.svelte';

	import type { Option } from './InputChoice.svelte';

	type T = $$Generic<string>;

	export let value: T[];
	export let options: Option<T>[];

	$: optionValues = options.map((o) => o.value);
	$: optionTextByValue = Object.fromEntries(
		options.map((o) => [o.value, o.text]),
	);
</script>

<InputChoiceMultipleSlotted
	{value}
	options={optionValues}
	showInput={true}
	let:option
>
	{optionTextByValue[option]}
</InputChoiceMultipleSlotted>
