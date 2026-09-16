import { z } from 'astro/zod';

const date = z.coerce.date();

const sharedContentFields = {
  tags: z.array(z.string()).default([]),
  publishedAt: date.optional(),
  updatedAt: date.optional(),
};

export const journalSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.literal('journal'),
  occurredAt: date,
  ...sharedContentFields,
  sourceUrl: z.string().url().optional(),
  sourceName: z.string().optional(),
  relatedDocs: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.literal('project'),
  status: z.enum(['planned', 'active', 'paused', 'completed']).default('planned'),
  startedAt: date.optional(),
  ...sharedContentFields,
  relatedDocs: z.array(z.string()).default([]),
  relatedJournal: z.array(z.string()).default([]),
});

export const docsSchemaExtension = z.object({
  type: z.literal('note').default('note'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  firstLearnedAt: date.optional(),
  publishedAt: date.optional(),
  updatedAt: date.optional(),
  status: z.enum(['draft', 'active', 'stable', 'archived']).default('active'),
});
