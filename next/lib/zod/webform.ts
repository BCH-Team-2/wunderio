import { DrupalNode } from "next-drupal";
import { z } from "zod";

export const WebformFieldsSchema = z.object({
  first_name: z
    .object({
      "#type": z.literal("textfield"),
      "#title": z.literal("First name"),
      "#required": z.boolean(),
    })
    .optional(),
  last_name: z
    .object({
      "#type": z.literal("textfield"),
      "#title": z.literal("Last name"),
      "#required": z.boolean(),
    })
    .optional(),
  email: z
    .object({
      "#type": z.literal("email"),
      "#title": z.literal("Email"),
      "#required": z.boolean(),
    })
    .optional(),
  age: z
    .object({
      "#type": z.literal("number"),
      "#title": z.literal("Age"),
      "#required": z.boolean(),
      "#min": z.number().optional(),
      "#max": z.number().optional(),
    })
    .optional(),
  participant: z.object({
    "#type": z.literal("checkbox"),
    "#title": z.literal("Participant"),
    "#required": z.boolean().optional(),
  }),
});

export const WebformSchema = z.object({
  id: z.string(),
  resourceIdObjMeta: z.object({
    drupal_internal__target_id: z.string(),
  }),
  field_webform_fields: WebformFieldsSchema.optional(),
});

export function validateAndCleanupWebform(form: DrupalNode): Webform | null {
  try {
    return WebformSchema.parse(form);
  } catch (error) {
    const { name = "ZodError", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, form }, null, 2));
    return null;
  }
}

export function validateAndCleanupWebformFields(
  field: DrupalNode,
): WebformFields | null {
  try {
    return WebformFieldsSchema.parse(field);
  } catch (error) {
    const { name = "ZodError", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, field }, null, 2));
    return null;
  }
}

export type WebformFields = z.infer<typeof WebformFieldsSchema>;
export type Webform = z.infer<typeof WebformSchema>;
