
/* eslint-disable node/no-unpublished-import */
import preact from '@preact/preset-vite';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [preact()],
	root: 'frontend',
	resolve: {
		alias: {
			$: path.resolve('./frontend/src'),
		},
	},
});
