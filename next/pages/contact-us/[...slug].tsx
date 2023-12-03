import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { DrupalNode, DrupalTranslatedPath } from "next-drupal";
import { useTranslation } from "next-i18next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LayoutProps } from "@/components/layout";
import { Meta } from "@/components/meta";
import { Paragraph } from "@/components/paragraph";
import {
  createLanguageLinks,
  LanguageLinks,
} from "@/lib/contexts/language-links-context";
import { drupal } from "@/lib/drupal/drupal-client";
import {
  getNodePageJsonApiParams,
  ResourceType,
} from "@/lib/drupal/get-node-page-json-api-params";
import { getNodeTranslatedVersions } from "@/lib/drupal/get-node-translated-versions";
import {
  CommonPageProps,
  getCommonPageProps,
} from "@/lib/get-common-page-props";
import { HeadingSection } from "@/lib/zod/paragraph";

interface ContactUsPageProps extends CommonPageProps {
}

export default function ContactUsPages({

}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();

  const breadcrumbs = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("contact us"),
      url: "/contact-us-0",
    },
  ];

  return (
    <>
      <Meta title={services.title} metatags={services.metatag} />
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <div>
        {services.field_content_elements?.map((paragraph) => {
          const { field_excerpt, ...props } = paragraph as HeadingSection;
          return <Paragraph key={paragraph.id} paragraph={props} />;
        })}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths = await drupal.getStaticPathsFromContext(
    "node--services_page",
    context,
  );
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ServicesProps> = async (
  context,
) => {
  const path: DrupalTranslatedPath = await drupal.translatePathFromContext(
    context,
    {
      pathPrefix: "/services",
    },
  );

  if (!path) {
    return {
      notFound: true,
    };
  }

  const allServices = (
    await drupal.getResourceCollectionFromContext<DrupalNode[]>(
      "node--services_page",
      context,
      {
        params: getNodePageJsonApiParams("node--services_page")
          .addFilter("title", "Services")
          .getQueryObject(),
      },
    )
  ).at(0);

  const servicesTypes = await drupal.getResourceCollectionFromContext<
    DrupalNode[]
  >("node--services_page", context, {
    params: getNodePageJsonApiParams("node--services_page").getQueryObject(),
  });

  const type = path.jsonapi.resourceName as ResourceType;

  const apiParams = getNodePageJsonApiParams(type).getQueryObject();

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: apiParams,
      pathPrefix: "/services",
    },
  );

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }
  const nodeTranslations = await getNodeTranslatedVersions(
    resource,
    context,
    drupal,
  );

  const languageLinks = createLanguageLinks(nodeTranslations);

  return {
    props: {
      ...(await getCommonPageProps(context)),
      services: validateAndCleanupServices(resource),
      allServices: validateAndCleanupServices(allServices),
      servicesTypes: servicesTypes
        .filter((node) => node.title !== "Services")
        .map((node) => validateAndCleanupServices(node)),
      languageLinks,
    },
    revalidate: 60,
  };
};