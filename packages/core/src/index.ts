import { getSpecifications } from './integrations/w3/css/client.js';

const specs = await getSpecifications();
console.log(specs);
