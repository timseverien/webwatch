import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [svelte()],
	vite: {
		optimizeDeps: { exclude: ['fsevents'] },
	},
});
