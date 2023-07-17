import {
	ECMA262_INTEGRATION,
	ECMA402_INTEGRATION,
} from '@ww/core/src/integrations/tc39';
import { W3_INTEGRATION } from '@ww/core/src/integrations/w3';
import * as fs from 'node:fs/promises';
import path from 'node:path';

const DIR_OUT = path.resolve(__dirname, '..');

const workers: [string, () => Promise<any>][] = [
	['ecma262.json', ECMA262_INTEGRATION.getSpecifications],
	['ecma402.json', ECMA402_INTEGRATION.getSpecifications],
	['w3.json', W3_INTEGRATION.getSpecifications],
];

for (const [outFile, worker] of workers) {
	const data = await worker();
	await fs.writeFile(path.resolve(DIR_OUT, outFile), JSON.stringify(data));
}
