import { getProposals } from './integrations/tc39/ecma262/client.js';
import { getProposals as getIntlProposals } from './integrations/tc39/ecma402/client.js';

const proposals = await getProposals();
console.log(proposals.map((p) => p.name).join('\n'));

const intlProposals = await getIntlProposals();
console.log(intlProposals.map((p) => p.name).join('\n'));
