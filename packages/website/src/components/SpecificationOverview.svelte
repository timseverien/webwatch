<script lang="ts">
	import { isAfter, isEqual, startOfDay, sub } from 'date-fns';
	import {
		isSpecificationInEqualOrLaterStage,
		type Specification,
		type SpecificationStage,
	} from '../data';
	import SpecificationCardList from './SpecificationCardList.svelte';
	import InputDate from './InputDate.svelte';
	import InputChoice, { type Option } from './InputChoice.svelte';
	import Flow from './Flow.svelte';

	type FilterType = 'LAST_UPDATED' | 'NAME' | 'STAGE';

	function applyFilters(
		specifications: Specification[],
		filters: {
			lastUpdatedMin: Date | null;
			name: string | null;
			stageMin: SpecificationStage | null;
		},
	) {
		let specsFiltered = specifications;

		if (filters.lastUpdatedMin) {
			specsFiltered = specsFiltered.filter(
				(spec) =>
					spec.lastUpdated &&
					(isEqual(spec.lastUpdated, filters.lastUpdatedMin!) ||
						isAfter(spec.lastUpdated, filters.lastUpdatedMin!)),
			);
		}

		if (filters.name) {
			specsFiltered = specsFiltered.filter((spec) =>
				spec.name.toLocaleLowerCase().includes(filters.name!.toLowerCase()),
			);
		}

		if (filters.stageMin) {
			specsFiltered = specsFiltered.filter((spec) =>
				isSpecificationInEqualOrLaterStage(spec, filters.stageMin!),
			);
		}

		return specsFiltered;
	}

	const TODAY = startOfDay(new Date());

	const STAGE_OPTIONS: Option<SpecificationStage>[] = [
		{ text: 'Upcoming', value: 'UPCOMING' },
		{ text: 'Completed', value: 'COMPLETED' },
	];

	// Data props
	export let enabledFilters: FilterType[] = ['LAST_UPDATED', 'NAME', 'STAGE'];
	export let specifications: Specification[];

	// Filter preset props
	export let lastUpdatedMin: Date = sub(TODAY, { years: 5 });
	export let nameQuery: string = '';
	export let stageMin: SpecificationStage = 'COMPLETED';

	$: specificationsFiltered = applyFilters(specifications, {
		lastUpdatedMin: enabledFilters.includes('LAST_UPDATED')
			? lastUpdatedMin
			: null,
		name: enabledFilters.includes('NAME') ? nameQuery : null,
		stageMin: enabledFilters.includes('STAGE') ? stageMin : null,
	});
</script>

{#if enabledFilters.length > 0}
	<div class="filters">
		{#if enabledFilters.includes('NAME')}
			<div>
				<label for="filter-name">Name</label>
				<input type="search" bind:value={nameQuery} id="filter-name" />
			</div>
		{/if}

		{#if enabledFilters.includes('LAST_UPDATED')}
			<div>
				<label for="filter-last-updated">Last updated</label>
				<InputDate bind:value={lastUpdatedMin} id="filter-last-updated" />
			</div>
		{/if}

		{#if enabledFilters.includes('STAGE')}
			<fieldset>
				<legend>Stage (minimum)</legend>
				<Flow size={0.5} direction="INLINE">
					<InputChoice options={STAGE_OPTIONS} bind:value={stageMin} />
				</Flow>
			</fieldset>
		{/if}
	</div>
{/if}

<SpecificationCardList ds={specificationsFiltered} />

<style>
	.filters {
		display: flex;
		gap: 1em;
		flex-flow: row wrap;
	}
</style>
