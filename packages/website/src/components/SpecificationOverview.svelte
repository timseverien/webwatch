<script lang="ts">
	import {
		W3_SPECIFICATION_TYPES,
		W3_SPECIFICATION_TYPE_LABEL_MAP,
	} from '@ww/core/src/integrations/w3';
	import { isAfter, isEqual, startOfDay, sub } from 'date-fns';
	import {
		getSpecificationStage,
		type Specification,
		type SpecificationStage,
	} from '../data';
	import Flow from './Flow.svelte';
	import type { Option } from './InputChoice.svelte';
	import InputChoiceMultiple from './InputChoiceMultiple.svelte';
	import InputDate from './InputDate.svelte';
	import SpecificationCardList from './SpecificationCardList.svelte';

	type FilterType = 'LAST_UPDATED' | 'NAME' | 'STAGE' | 'TYPE';

	function applyFilters(
		specifications: Specification[],
		filters: {
			lastUpdatedMin: Date | null;
			name: string | null;
			stages: SpecificationStage[];
			types: Specification['type'][];
		},
	) {
		let specsFiltered = specifications;

		if (filters.types.length > 0) {
			specsFiltered = specsFiltered.filter((spec) =>
				filters.types.includes(spec.type),
			);
		}

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

		if (filters.stages) {
			specsFiltered = specsFiltered.filter((spec) =>
				filters.stages?.includes(getSpecificationStage(spec)),
			);
		}

		return specsFiltered;
	}

	const TODAY = startOfDay(new Date());

	const STAGE_OPTIONS: Option<SpecificationStage>[] = [
		{ text: 'Upcoming', value: 'UPCOMING' },
		{ text: 'Completed', value: 'COMPLETED' },
	];

	const TYPE_OPTIONS: Option<Specification['type']>[] = (
		[
			{ text: 'JavaScript', value: 'TC39_SPECIFICATION' },
			...W3_SPECIFICATION_TYPES.map((value) => {
				if (value === 'W3_SPECIFICATION') {
					return {
						text: 'Other',
						value,
					};
				}

				return {
					text: W3_SPECIFICATION_TYPE_LABEL_MAP[value],
					value,
				};
			}),
		] as Option<Specification['type']>[]
	).sort((a, b) => {
		const aText = a.value !== 'W3_SPECIFICATION' ? a.text : 'ZZZ';
		const bText = b.value !== 'W3_SPECIFICATION' ? b.text : 'ZZZ';
		return aText.localeCompare(bText);
	});

	// Data props
	export let enabledFilters: FilterType[] = [
		'LAST_UPDATED',
		'NAME',
		'STAGE',
		'TYPE',
	];
	export let specifications: Specification[];

	// Filter preset props
	export let lastUpdatedMin: Date = sub(TODAY, { years: 5 });
	export let nameQuery: string = '';
	export let stages: SpecificationStage[] = ['UPCOMING', 'COMPLETED'];
	export let types: Specification['type'][] = [
		'CSS_SPECIFICATION',
		'DOM_SPECIFICATION',
		'HTML_SPECIFICATION',
		'SVG_SPECIFICATION',
		'TC39_SPECIFICATION',
		'WAI_ARIA_SPECIFICATION',
		'WEB_API_SPECIFICATION',
	];

	$: specificationsFiltered = applyFilters(specifications, {
		lastUpdatedMin: enabledFilters.includes('LAST_UPDATED')
			? lastUpdatedMin
			: null,
		name: enabledFilters.includes('NAME') ? nameQuery : null,
		stages: enabledFilters.includes('STAGE') ? stages : [],
		types: enabledFilters.includes('TYPE') ? types : [],
	});
</script>

{#if enabledFilters.length > 0}
	<div>
		{#if enabledFilters.includes('TYPE')}
			<fieldset>
				<legend>Category</legend>
				<Flow direction="INLINE" size={0.25}>
					<InputChoiceMultiple options={TYPE_OPTIONS} bind:value={types} />
				</Flow>
			</fieldset>
		{/if}
	</div>
	<Flow direction="INLINE">
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
				<legend>Stage</legend>
				<Flow size={0.5} direction="INLINE">
					<InputChoiceMultiple options={STAGE_OPTIONS} bind:value={stages} />
				</Flow>
			</fieldset>
		{/if}
	</Flow>
{/if}

<div>
	<SpecificationCardList ds={specificationsFiltered} />
</div>
