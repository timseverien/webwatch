import { createNumberRange } from './math';
import { PaletteToken, printPaletteToken } from './palette';

const PALETTE_RANGE_VALUES_ALL: number[] = createNumberRange(1 + 100 / 10).map(
	(n) => Math.round(1000 * n) / 10,
);
const PALETTE_RANGE_VALUES_WITH_COLOR: number[] = createNumberRange(9).map(
	(n) => 10 + 80 * n,
);

const PALETTE_TOKENS: PaletteToken[] = [
	{
		type: 'PALETTE_HUE_RANGE',
		name: 'palette-neutral',
		hue: 216,
		saturation: 0.05,
		values: PALETTE_RANGE_VALUES_ALL,
	},
	{
		type: 'PALETTE_HUE_RANGE',
		name: 'palette-primary',
		hue: 216,
		saturation: 0.78,
		values: PALETTE_RANGE_VALUES_WITH_COLOR,
	},
	{
		type: 'PALETTE_HUE_RANGE',
		name: 'palette-secondary',
		hue: 319,
		saturation: 0.78,
		values: PALETTE_RANGE_VALUES_WITH_COLOR,
	},
];

PALETTE_TOKENS.forEach((token) => printPaletteToken(token));
