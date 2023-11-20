import { GetStaticProps, InferGetStaticPropsType } from "next";
import { DrupalNode } from "next-drupal";
import { useTranslation } from "next-i18next";
import { resolveWebformContent, Webform } from "nextjs-drupal-webform";
import { Carousel } from "@material-tailwind/react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CareersForm } from "@/components/careers-form";
import { LayoutProps } from "@/components/layout";
import OpenPositions from "@/components/open-positions";
import { Paragraph } from "@/components/paragraph";
import { createLanguageLinks } from "@/lib/contexts/language-links-context";
import { drupal } from "@/lib/drupal/drupal-client";
import { getNodePageJsonApiParams } from "@/lib/drupal/get-node-page-json-api-params";
import { getNodeTranslatedVersions } from "@/lib/drupal/get-node-translated-versions";
import { getCommonPageProps } from "@/lib/get-common-page-props";
import { Careers, validateAndCleanupCareers } from "@/lib/zod/careers";
import {
  OpenPositions as OpenPositionsType,
  validateAndCleanupOpenPositions,
} from "@/lib/zod/open-positions";
import { HeadingSection } from "@/lib/zod/paragraph";

interface CareersPageProps extends LayoutProps {
  careers: Careers;
  openPositions: OpenPositionsType[];
}

export default function CareersPage({
  careers,
  openPositions,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const breadcrumbs = [
    {
      title: t("homepage-link"),
      url: "/",
    },
    {
      title: t("careers-link"),
      url: "/careers",
    },
  ];

  const headingSection = careers.field_content_elements.find(
    (element) => element.type === "paragraph--heading_section",
  ) as HeadingSection;
  return (
    <>
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <div className="flex h-[100px] bg-primary-400/40 justify-between">
        <h1>{headingSection?.field_heading}</h1>
        <span>{headingSection?.field_excerpt}</span>
      </div>
      <div className="grid gap-4">
        {careers.field_content_elements?.map((paragraph) => (
          <Paragraph key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>
      <CareersForm />
      <OpenPositions openPositions={openPositions} />
    </>
  );
}

export const getStaticProps: GetStaticProps<CareersPageProps> = async (
  context,
) => {
  const careers = (
    await drupal.getResourceCollectionFromContext<DrupalNode[]>(
      "node--careers",
      context,
      {
        params: getNodePageJsonApiParams("node--careers").getQueryObject(),
      },
    )
  ).at(0);

  const nodeTranslations = await getNodeTranslatedVersions(
    careers,
    context,
    drupal,
  );

  const languageLinks = createLanguageLinks(nodeTranslations);

  const openPositions = await drupal.getResourceCollectionFromContext<
    DrupalNode[]
  >("node--open_positions", context, {
    params: getNodePageJsonApiParams("node--open_positions").getQueryObject(),
  });

  return {
    props: {
      ...(await getCommonPageProps(context)),
      careers: validateAndCleanupCareers(careers),
      openPositions: openPositions.map((node) =>
        validateAndCleanupOpenPositions(node),
      ),
      languageLinks,
    },
    revalidate: 60,
  };
};
