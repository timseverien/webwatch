<script lang="ts">
	import { format } from 'date-fns';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends Omit<HTMLInputAttributes, 'value'> {
		value: Date;
	}

	export let value: $$Props['value'] = new Date();
	let valueFormatted: string;

	$: valueFormatted = format(value, 'yyyy-MM-dd');
</script>

<input
	type="date"
	value={valueFormatted}
	on:change={(event) => {
		if (!event.currentTarget.valueAsDate) return;
		value = event.currentTarget.valueAsDate;
	}}
/>
