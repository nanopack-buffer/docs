import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "NanoPack",
			social: {
				github: "https://github.com/nanopack-buffer",
			},
			sidebar: [
				{
					label: "Introduction",
					autogenerate: { directory: "introduction" },
				},
				{
					label: "Guides",
					items: [
						{ label: "Getting Started", slug: "guides/getting-started" },
						{ label: "Defining a Message", slug: "guides/defining-message" },
						{ label: "Defining an Enum", slug: "guides/defining-enum" },
						{ label: "Data Types", slug: "guides/data-types" },
						{ label: "Generating Code", slug: "guides/generating-code" },
					],
				},
				{
					label: "Binary Format",
					autogenerate: { directory: "binary-format" },
				},
			],
		}),
	],
});
