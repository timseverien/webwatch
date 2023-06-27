import { getProposals as getEcma262Proposals } from '@ww/core/src/integrations/tc39/ecma262';
import { getProposals as getEcma402Proposals } from '@ww/core/src/integrations/tc39/ecma402';
import { getSpecifications as getW3Specifications } from '@ww/core/src/integrations/w3';
import * as fs from 'node:fs/promises';
import path from 'node:path';

const DIR_OUT = path.resolve(__dirname, '..');

const workers: [string, () => Promise<any>][] = [
	['ecma262.json', getEcma262Proposals],
	['ecma402.json', getEcma402Proposals],
	['w3.json', getW3Specifications],
];

for (const [outFile, worker] of workers) {
	const data = await worker();
	await fs.writeFile(path.resolve(DIR_OUT, outFile), JSON.stringify(data));
}
