<script lang="ts">
	import { isAfter, isEqual, startOfDay, sub } from 'date-fns';
	import {
		SPECIFICATION_STAGE_LABEL_MAP,
		SPECIFICATION_TAG_LABEL_MAP,
		getSpecificationStage,
		type SpecificationStage,
		type SpecificationTag,
		type SpecificationWithId,
	} from '../data';
	import Button from './Button.svelte';
	import CenteredMessage from './CenteredMessage.svelte';
	import Chip from './Chip.svelte';
	import Flow from './Flow.svelte';
	import InputChoiceMultipleSlotted from './InputChoiceMultipleSlotted.svelte';
	import InputDate from './InputDate.svelte';
	import SpecificationCardList from './SpecificationCardList.svelte';
	import TextContent from './TextContent.svelte';
	import TagChip from './integrations/TagChip.svelte';

	type FilterType = 'LAST_UPDATED' | 'NAME' | 'STAGE' | 'TAG';

	function applyFilters(
		specifications: SpecificationWithId[],
		filters: {
			lastUpdatedMin: Date | null;
			name: string | null;
			stages: SpecificationStage[];
			tags: SpecificationTag[];
		},
	) {
		let specsFiltered = specifications;

		if (filters.tags.length > 0) {
			specsFiltered = specsFiltered.filter((spec) =>
				spec.tags.some((tag) => filters.tags.includes(tag)),
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

		if (filters.stages.length > 0) {
			specsFiltered = specsFiltered.filter((spec) =>
				filters.stages?.includes(getSpecificationStage(spec)),
			);
		}

		return specsFiltered;
	}

	const TODAY = startOfDay(new Date());

	const STAGE_OPTIONS: SpecificationStage[] = ['UPCOMING', 'COMPLETED'];

	const TAG_OPTIONS: SpecificationTag[] = Object.keys(
		SPECIFICATION_TAG_LABEL_MAP,
	) as SpecificationTag[];

	const FILTER_LAST_UPDATED_DEFAULT_VALUE = sub(TODAY, { years: 5 });
	const FILTER_NAME_DEFAULT_VALUE = '';
	const FILTER_STAGE_DEFAULT_VALUE: SpecificationStage[] = ['COMPLETED'];
	const FILTER_TAGS_DEFAULT_VALUE: SpecificationTag[] = [
		'Accessibility',
		'CSS',
		'DOM',
		'ECMA262',
		'ECMA402',
		'HTML',
		'Web API',
		'Web Fonts',
	];

	// Data props
	export let enabledFilters: FilterType[] = [
		'LAST_UPDATED',
		'NAME',
		'STAGE',
		'TAG',
	];
	export let specifications: SpecificationWithId[];

	// Filter preset props
	export let lastUpdatedMin: Date = FILTER_LAST_UPDATED_DEFAULT_VALUE;
	export let nameQuery: string = FILTER_NAME_DEFAULT_VALUE;
	export let stages: SpecificationStage[] = FILTER_STAGE_DEFAULT_VALUE;
	export let tags: SpecificationTag[] = FILTER_TAGS_DEFAULT_VALUE;

	function resetFilters() {
		lastUpdatedMin = FILTER_LAST_UPDATED_DEFAULT_VALUE;
		nameQuery = FILTER_NAME_DEFAULT_VALUE;
		stages = FILTER_STAGE_DEFAULT_VALUE;
		tags = FILTER_TAGS_DEFAULT_VALUE;
	}

	$: specificationsFiltered = applyFilters(specifications, {
		lastUpdatedMin: enabledFilters.includes('LAST_UPDATED')
			? lastUpdatedMin
			: new Date(0),
		name:
			enabledFilters.includes('NAME') && nameQuery.length > 0
				? nameQuery
				: null,
		stages: enabledFilters.includes('STAGE') ? stages : [],
		tags: enabledFilters.includes('TAG') ? tags : [],
	});

	$: tagOptionsSorted = Array.from(TAG_OPTIONS).sort((a, b) => {
		const aLabel = SPECIFICATION_TAG_LABEL_MAP[a];
		const bLabel = SPECIFICATION_TAG_LABEL_MAP[b];
		// Non-visible labels solely for prioritizing selected tags
		const aLabelVirtual = tags.includes(a) ? `@${aLabel}` : aLabel;
		const bLabelVirtual = tags.includes(b) ? `@${bLabel}` : bLabel;
		return aLabelVirtual.localeCompare(bLabelVirtual);
	});
</script>

<TextContent size="wide">
	<Flow>
		{#if enabledFilters.includes('TAG')}
			<fieldset>
				<legend>Categories</legend>
				<Flow direction="INLINE" size={0.5}>
					{#if enabledFilters.includes('TAG')}
						<InputChoiceMultipleSlotted
							bind:value={tags}
							options={tagOptionsSorted}
							let:option
							let:isSelected
						>
							<TagChip tag={option} active={isSelected} />
						</InputChoiceMultipleSlotted>
					{:else}
						{#each tags as tag}
							<TagChip {tag} active={true} />
						{/each}
					{/if}
				</Flow>
			</fieldset>
		{/if}

		{#if enabledFilters.includes('NAME') || enabledFilters.includes('LAST_UPDATED') || enabledFilters.includes('STAGE')}
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
						<Flow direction="INLINE" size={0.5}>
							<InputChoiceMultipleSlotted
								bind:value={stages}
								options={STAGE_OPTIONS}
								let:option
								let:isSelected
							>
								<Chip color={isSelected ? 'primary' : undefined}>
									{SPECIFICATION_STAGE_LABEL_MAP[option]}
								</Chip>
							</InputChoiceMultipleSlotted>
						</Flow>
					</fieldset>
				{/if}
			</Flow>
		{/if}
	</Flow>
</TextContent>

<div>
	{#if specificationsFiltered.length > 0}
		<SpecificationCardList specifications={specificationsFiltered} />
	{:else}
		<CenteredMessage>
			<Flow>
				<h2>No results</h2>
				<p>The currently configured filters doesn’t match any specification.</p>
				<div>
					<Button on:click={() => resetFilters()}>Reset filters</Button>
				</div>
			</Flow>
		</CenteredMessage>
	{/if}
</div>
