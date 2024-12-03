import { z } from 'zod';

export const environmentSchema = z.object({
  api: z.object({
    baseUrl: z.string().min(1).refine(
      (url) => url.startsWith('/') || url.startsWith('http'),
      { message: 'API URL must start with / or http' }
    )
  }),
  scrapingBee: z.object({
    apiKey: z.string().optional(),
    baseUrl: z.string().url()
  }),
  app: z.object({
    env: z.enum(['development', 'production', 'test']),
    isDev: z.boolean(),
    isProd: z.boolean(),
    isTest: z.boolean()
  })
});

export const analysisResultSchema = z.object({
  title: z.string(),
  metaDescription: z.string(),
  headings: z.object({
    h1: z.array(z.string()),
    h2: z.array(z.string()),
    h3: z.array(z.string()),
    h4: z.array(z.string())
  }),
  totalWords: z.number().int().positive(),
  twoWordPhrases: z.array(z.object({
    keyword: z.string(),
    count: z.number().int().positive(),
    density: z.number().min(0).max(1),
    prominence: z.number().min(0).max(1)
  })),
  threeWordPhrases: z.array(z.object({
    keyword: z.string(),
    count: z.number().int().positive(),
    density: z.number().min(0).max(1),
    prominence: z.number().min(0).max(1)
  })),
  fourWordPhrases: z.array(z.object({
    keyword: z.string(),
    count: z.number().int().positive(),
    density: z.number().min(0).max(1),
    prominence: z.number().min(0).max(1)
  })),
  scrapedContent: z.string()
});

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export type AnalysisResultSchema = z.infer<typeof analysisResultSchema>;