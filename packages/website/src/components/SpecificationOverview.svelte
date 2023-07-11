<script lang="ts">
	import { isAfter, isEqual, startOfDay, sub } from 'date-fns';
	import {
		SPECIFICATION_TAG_LABEL_MAP,
		getSpecificationStage,
		type Specification,
		type SpecificationStage,
		type SpecificationTag,
		SPECIFICATION_STAGE_LABEL_MAP,
	} from '../data';
	import Flow from './Flow.svelte';
	import InputChoiceMultipleSlotted from './InputChoiceMultipleSlotted.svelte';
	import InputDate from './InputDate.svelte';
	import SpecificationCardList from './SpecificationCardList.svelte';
	import TagChip from './integrations/TagChip.svelte';
	import Chip from './Chip.svelte';
	import TextContent from './TextContent.svelte';

	type FilterType = 'LAST_UPDATED' | 'NAME' | 'STAGE' | 'TAG';

	function applyFilters(
		specifications: Specification[],
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

		if (filters.stages) {
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

	// Data props
	export let enabledFilters: FilterType[] = [
		'LAST_UPDATED',
		'NAME',
		'STAGE',
		'TAG',
	];
	export let specifications: Specification[];

	// Filter preset props
	export let lastUpdatedMin: Date = sub(TODAY, { years: 5 });
	export let nameQuery: string = '';
	export let stages: SpecificationStage[] = ['COMPLETED'];
	export let tags: SpecificationTag[] = [
		'Accessibility',
		'CSS',
		'DOM',
		'ECMA262',
		'ECMA402',
		'HTML',
		'Web API',
		'Web Fonts',
	];

	$: specificationsFiltered = applyFilters(specifications, {
		lastUpdatedMin: lastUpdatedMin,
		name: nameQuery.length > 0 ? nameQuery : null,
		stages: stages,
		tags: tags,
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
		{#if enabledFilters.length > 0}
			<div>
				{#if enabledFilters.includes('TAG')}
					<fieldset>
						<legend>Categories</legend>
						<Flow direction="INLINE" size={0.5}>
							<InputChoiceMultipleSlotted
								bind:value={tags}
								options={tagOptionsSorted}
								let:option
								let:isSelected
							>
								<TagChip tag={option} active={isSelected} />
							</InputChoiceMultipleSlotted>
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
	<SpecificationCardList specifications={specificationsFiltered} />
</div>
