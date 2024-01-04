import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Simple Stack 🌱',
			social: {
				github: 'https://github.com/bholmesdev/simple-stack',
				discord: 'https://wtw.dev/chat',
			},
			sidebar: [
				{
					label: 'Packages',
					autogenerate: { directory: 'packages' },
				},
			],
		}),
	],
});
