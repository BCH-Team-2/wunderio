import { DrupalNode } from "next-drupal";
import { z } from "zod";

import { MetatagsSchema } from "@/lib/zod/metatag";
import { ImageShape } from "@/lib/zod/paragraph";

export const ArticleBaseSchema = z.object({
  type: z.literal("node--article"),
  id: z.string(),
  created: z.string(),
  sticky: z.boolean().optional(),
  uid: z.object({
    id: z.string(),
    display_name: z.string(),
    field_profile_picture: ImageShape.nullable().optional(),
  }),
  title: z.string(),
  field_image: ImageShape.nullable(),
  field_excerpt: z.string().optional().nullable(),
  field_tags: z
    .array(
      z.object({
        name: z.string().nullable(),
      }),
    )
    .nullable()
    .optional(),
  path: z.object({
    alias: z.string(),
  }),
});

const ArticleSchema = ArticleBaseSchema.extend({
  metatag: MetatagsSchema.optional(),
  body: z.object({
    processed: z.string(),
  }),
});

export function validateAndCleanupArticle(article: DrupalNode): Article | null {
  try {
    return ArticleSchema.parse(article);
  } catch (error) {
    const { name = "ZodError Article", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, article }, null, 2));
    return null;
  }
}

export type Article = z.infer<typeof ArticleSchema>;
