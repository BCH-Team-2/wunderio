import { DrupalNode } from "next-drupal";
import { z } from "zod";

import { MetatagsSchema } from "@/lib/zod/metatag";
import {
  FormattedTextSchema,
  HeadingSectionSchema,
  TestimonialsSchema,
} from "@/lib/zod/paragraph";

const CareersElementsSchema = z.discriminatedUnion("type", [
  TestimonialsSchema,
  HeadingSectionSchema,
  FormattedTextSchema,
]);

export const CareersSchema = z.object({
  type: z.literal("node--careers"),
  id: z.string(),
  title: z.string(),
  field_content_elements: z.array(CareersElementsSchema),
  metatag: MetatagsSchema.optional(),
});

const BasicInfoSchema = z.object({
  type: z.literal("node--basic_info_related_to_all_positi"),
  id: z.string(),
  body: z.object({
    value: z.string(),
    format: z.string(),
    processed: z.string(),
  }),
});

export function validateAndCleanupCareers(careers: DrupalNode): Careers | null {
  try {
    const topLevelCareersData = CareersSchema.omit({
      field_content_elements: true,
    }).parse(careers);

    const validatedParagraphs = careers.field_content_elements
      .map((paragraph: any) => {
        const result = CareersElementsSchema.safeParse(paragraph);

        switch (result.success) {
          case true:
            return result.data;
          case false:
            console.log(
              `Error validating careers paragraph ${paragraph.type}: `,
              JSON.stringify(result.error, null, 2),
            );
            return null;
        }
      })
      .filter(Boolean);

    return {
      ...topLevelCareersData,
      field_content_elements: validatedParagraphs,
    };
  } catch (error) {
    const { name = "ZodError", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, careers }, null, 2));
    return null;
  }
}

export function validateAndCleanupBasicInfo(
  basicInfo: DrupalNode,
): BasicInfo | null {
  try {
    return BasicInfoSchema.parse(basicInfo);
  } catch (error) {
    const { name = "ZodError", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, basicInfo }, null, 2));
    return null;
  }
}

export type BasicInfo = z.infer<typeof BasicInfoSchema>;
export type Careers = z.infer<typeof CareersSchema>;
