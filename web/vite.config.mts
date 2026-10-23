import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	build: {
		outDir: 'build',
		sourcemap: false,
		chunkSizeWarningLimit: 2000,
	},
	server: {
		port: 3001,
	},
	preview: {
		port: 4173,
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [react()],
});
