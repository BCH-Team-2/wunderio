import { DrupalNode } from "next-drupal";
import { z } from "zod";

import { MetatagsSchema } from "@/lib/zod/metatag";


export const NumbersSchema = z.object({
    type: z.literal("node--numbers"),
    id: z.string(),
    title: z.string(),
    body: z.object({
        value: z.string(),
        format: z.string(),
        processed: z.string(),
    }).optional().nullable(),
    field_number: z.object({
        value: z.string(),
        format: z.string(),
        processed: z.string(),
    }),
    field_text: z.object({
        value: z.string(),
        format: z.string(),
        processed: z.string(),
    }),
    field_numbers_type: z.object({
        name: z.string(),
    }),
    path: z.object({
        alias: z.string(),
    }).optional().nullable(),
    metatag: MetatagsSchema.optional(),
});

export function validateAndCleanupNumbers(
    numbers: DrupalNode,
): Numbers | null {
    try {
        return NumbersSchema.parse(numbers);
    } catch (error) {
        const { name = "ZodError", issues = [] } = error;
        console.log(JSON.stringify({ name, issues, numbers }, null, 2));
        return null;
    }
}

export type Numbers = z.infer<typeof NumbersSchema>;