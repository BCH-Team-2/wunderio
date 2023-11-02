import { GetStaticProps, InferGetStaticPropsType } from "next";
import { DrupalNode } from "next-drupal";
import { useTranslation } from "next-i18next";

import { LayoutProps } from "@/components/layout";

import { drupal } from "@/lib/drupal/drupal-client";
import { getCommonPageProps } from "@/lib/get-common-page-props";

import { Careers, validateAndCleanupCareers } from "@/lib/zod/careers";
import { OpenPositions as OpenPositionsType, validateAndCleanupOpenPositions } from "@/lib/zod/open-positions";
import { CareersForm } from "@/components/careers-form";
import { Paragraph } from "@/components/paragraph";
import { HeadingSection } from "@/lib/zod/paragraph";
import OpenPositions from "@/components/open-positions";
import { Breadcrumbs, BreadcrumbsProps } from "@/components/breadcrumbs";

interface CareersPageProps extends LayoutProps {
  careers: Careers;
  openPositions: OpenPositionsType[]
}

export default function CareersPage({
  careers,
  openPositions
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const breadcrumbs = [
    {
      title: "Home",
      url: "/"
    },
    {
      title: "Careers",
      url: "/careers"
    }
  ]

  const headingSection = careers.field_content_elements.find((element) => element.type === "paragraph--heading_section") as HeadingSection
  return (
    <>
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <div className="flex h-[100px] bg-primary-400/40 justify-between">
        <h1>{headingSection.field_heading}</h1>
        <span>{headingSection.field_excerpt}</span>
      </div>
      <div className="grid gap-4">
        {
          careers.field_content_elements?.map((paragraph) => (
            <Paragraph key={paragraph.id} paragraph={paragraph} />
          ))
        }
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
    await drupal.getResourceCollectionFromContext<DrupalNode[]>("node--careers", context,
      {
        params: {
          include: "uid,node_type,uid,field_content_elements,field_content_elements.field_image.field_media_image",
        }
      },
    )
  ).at(0);

  const openPositions = await drupal.getResourceCollectionFromContext<
    DrupalNode[]>("node--open_positions", context,
      {
        params: {
          include: "uid,node_type,revision_uid,uid,field_basic_info,field_country,field_office,field_position,field_position_image"
        }
      })

  return {
    props: {
      ...(await getCommonPageProps(context)),
      careers: validateAndCleanupCareers(careers),
      openPositions: openPositions.map((node) => validateAndCleanupOpenPositions(node))
    },
  };
};
