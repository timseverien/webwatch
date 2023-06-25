import { getProposals } from './integrations/tc39/ecma262/client.js';

const proposals = await getProposals();
console.log(proposals.map((p) => p.name).join('\n'));
