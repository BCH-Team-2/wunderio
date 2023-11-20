import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { StatusMessage } from "@/ui/status-message";

type Inputs = {
  first_name: string;
  last_name: string;
  email: string;
};

export function CareersForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    const response = await fetch(`/api/careers`, {
      method: "POST",
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
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

  if (isSubmitSuccessful) {
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
        {/* TODO add translations */}
        {t("form-careers-title")}
      </h2>
      <>
        <div>
          <Label htmlFor="first_name">{t("form-label-first-name")}</Label>
          <Input
            type="text"
            id="first_name"
            {...register("first_name", {
              required: true,
            })}
          />
        </div>
        <div>
          <Label htmlFor="last_name">{t("form-label-last-name")}</Label>
          <Input
            type="text"
            id="last_name"
            {...register("last_name", {
              required: true,
            })}
          />
        </div>
        <div>
          <Label htmlFor="email">{t("form-label-email")}</Label>
          <Input
            type="email"
            id="email"
            {...register("email", {
              required: true,
            })}
          />
        </div>
        <Button type="submit">{t("form-careers-submit")}</Button>
      </>
    </form>
  );
}
