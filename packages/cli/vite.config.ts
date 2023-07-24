import { builtinModules } from 'node:module';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: 'node16',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['cjs'],
		},
		rollupOptions: {
			external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
		},
	},
	resolve: {
		// Added 'node' for chalk
		// See: https://vitejs.dev/config/shared-options.html#resolve-conditions
		conditions: ['import', 'module', 'node', 'default'],
	},
});
