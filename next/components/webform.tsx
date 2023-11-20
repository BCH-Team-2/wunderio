
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";

import { Webform } from "@/lib/zod/webform";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { StatusMessage } from "@/ui/status-message";

type FieldInputs = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  age?: number;
  message?: string;
  participant?: boolean;
};

interface WebformProps {
  webform: Webform;
}

/**
 * Renders a webform component with the given `webform` object.
 * @param {WebformProps} props - The props object containing the `webform` object.
 * @returns {JSX.Element} - The webform component.
 */
export function Webform({ webform }: WebformProps) {
  const fieldInputs = Object.keys(webform.field_webform_fields).map((key) => key)
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState,
  } = useForm<FieldInputs>();

  const onSubmit = async (data: FieldInputs) => {
    const response = await fetch(`/api/webform`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        webform_id: webform.resourceIdObjMeta.drupal_internal__target_id,
      }),
      headers: {
        "accept-language": router.locale,
      },
    });

    if (!response.ok) {
      alert("Error!");
    }
  };

  const onErrors = (errors) => console.error(errors);

  if (formState.isSubmitSuccessful) {
    return (
      <StatusMessage level="success" className="mx-auto w-full max-w-3xl">
        <p className="mb-4">{t("form-thank-you-message")}</p>
        <Button type="button" onClick={() => reset()}>
          {t("form-send-another-message")}
        </Button>
      </StatusMessage>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onErrors)}
      className="mx-auto mb-4 flex max-w-3xl flex-col gap-5 rounded border border-finnishwinter bg-white p-4 shadow-md transition-all hover:shadow-md"
    >
      <h2 className="text-heading-sm font-bold md:text-heading-md">
        {t("form-title")}
      </h2>
      <p>{t("form-description")}</p>
      {fieldInputs.map((key) => {
        return (
          <div key={key}>
            <Label htmlFor={webform.field_webform_fields[key]["#title"]}>
              {webform.field_webform_fields[key]["#title"]}
            </Label>
            <Input
              type={webform.field_webform_fields[key]["#type"]}
              id={webform.field_webform_fields[key]["#title"]}
              {...register(key as keyof FieldInputs, {
                required: webform.field_webform_fields[key]["#required"],
                min: webform.field_webform_fields[key]["#min"],
                max: webform.field_webform_fields[key]["#max"],
              })}
            />
            {formState.errors[key] && (
              <p>{formState.errors[key].message}</p>
            )}
          </div>
        );
      })}
      <Button disabled={!formState.isValid} type="submit">{t("form-submit")}</Button>
    </form>
  );
}
