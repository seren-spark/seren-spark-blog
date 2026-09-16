import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { docsSchemaExtension, journalSchema, projectSchema } from './content-schema';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: journalSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: projectSchema,
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: docsSchemaExtension }),
});

export const collections = { docs, journal, projects };
