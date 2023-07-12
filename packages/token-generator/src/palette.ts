export type PaletteTokenSettings = {
	values: number[];
};

export type PaletteHexToken = {
	type: 'PALETTE_HEX';
	name: string;
	value: string;
};

export type PaletteHueRangeToken = {
	type: 'PALETTE_HUE_RANGE';
	name: string;
	hue: number;
	saturation: number;
	values: number[];
};

export type PaletteToken = PaletteHexToken | PaletteHueRangeToken;

export function printPaletteToken(token: PaletteToken): void {
	switch (token.type) {
		case 'PALETTE_HEX':
			console.log(`--${token.name}: ${token.value}`);
			break;
		case 'PALETTE_HUE_RANGE':
			for (const value of token.values) {
				console.log(
					`--${token.name}-${value}: hsl(${token.hue}, ${
						100 * token.saturation
					}%, ${value}%);`,
				);
			}
			break;
	}
}
