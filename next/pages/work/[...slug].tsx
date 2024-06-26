import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { DrupalNode, DrupalTranslatedPath } from "next-drupal";
import { useTranslation } from "next-i18next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Meta } from "@/components/meta";
import Numbers from "@/components/numbers";
import { Paragraph } from "@/components/paragraph";
import { WorkArticleCard } from "@/components/workArticleCard";
import { WorkWorkCard } from "@/components/workWorkCard";
import { createLanguageLinks } from "@/lib/contexts/language-links-context";
import { drupal } from "@/lib/drupal/drupal-client";
import {
  getNodePageJsonApiParams,
  ResourceType,
} from "@/lib/drupal/get-node-page-json-api-params";
import { getNodeTranslatedVersions } from "@/lib/drupal/get-node-translated-versions";
import { getCommonPageProps } from "@/lib/get-common-page-props";
import { Article, validateAndCleanupArticle } from "@/lib/zod/article";
import {
  Numbers as NumbersType,
  validateAndCleanupNumbers,
} from "@/lib/zod/numbers";
import { Page as PageType, validateAndCleanupPage } from "@/lib/zod/page";

import NotFoundPage from "../404";

interface WorkPageProps {
  currentWorkPage: PageType;
  allWorkPages: PageType[];
  allArticles: Article[];
  numbers: NumbersType[];
}

export default function WorkPage({
  currentWorkPage,
  allWorkPages,
  allArticles,
  numbers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const breadcrumbs = [
    {
      title: t("work-link"),
      url: "/work",
    },
    {
      title: currentWorkPage.title,
      url: "/work" + currentWorkPage.title,
    },
  ];

  const allowedWorkPageTitles = [
    "Tikkurila",
    "Luke.fi",
    "Fortum",
    "HUS - Helsinki University Hospital",
    "Wunder loves Turku - the benefits of a long-term partnership",
    "Ministry of Defence of Latvia",
    "Finavia",
    "University Of Turku",
    "Ruutu.fi",
    "Service Advisor Applications",
  ].filter(Boolean);

  return currentWorkPage &&
    currentWorkPage.field_page_type &&
    currentWorkPage.field_page_type.name === "Work" ? (
    <>
      <Meta title={currentWorkPage.title} metatags={currentWorkPage.metatag} />
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>

      <div>
        {currentWorkPage.field_content_elements.map((paragraph) => (
          <Paragraph key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>

      {currentWorkPage.title === "Luke.fi" ? (
        <div>
          <Numbers
            numbers={numbers.filter(
              (lukeNumbers) =>
                lukeNumbers.field_numbers_type.name === "Work-Luke-Numbers",
            )}
          />
        </div>
      ) : null}

      {currentWorkPage.title === "Ministry of Defence of Latvia" ? (
        <div>
          <Numbers
            numbers={numbers.filter(
              (lukeNumbers) =>
                lukeNumbers.field_numbers_type.name ===
                "Work-MinistryOfDefenceLatvia-Numbers",
            )}
          />
        </div>
      ) : null}

      {currentWorkPage.title === "Finavia" ? (
        <div>
          <Numbers
            numbers={numbers.filter(
              (lukeNumbers) =>
                lukeNumbers.field_numbers_type.name === "Work-Finavia-Numbers",
            )}
          />
        </div>
      ) : null}
      {currentWorkPage.title === "HUS - Helsinki University Hospital" ? (
        <div>
          <Numbers
            numbers={numbers.filter(
              (lukeNumbers) =>
                lukeNumbers.field_numbers_type.name === "Work-HUS-Numbers",
            )}
          />
        </div>
      ) : null}

      {allowedWorkPageTitles.includes(currentWorkPage.title) ? (
        <div className="mt-20">
          <h1 className="uppercase text-main font-bold text-lg mb-4">
            {t("related-content")}
          </h1>
          <div className="md:grid grid-cols-3 gap-3">
            {allWorkPages
              .filter((workPages) => workPages.title !== currentWorkPage.title)
              .slice(0, 3)
              .map((workPage) => (
                <WorkWorkCard key={workPage.id} workPage={workPage} />
              ))}
          </div>
        </div>
      ) : null}

      {currentWorkPage.title === "Trimble" ||
      currentWorkPage.title === "Central Statistical Bureau of Latvia" ? (
        <div className="mt-20">
          <h1 className="uppercase text-main font-bold text-lg mb-4">
            {t("related-content")}
          </h1>
          <div className="md:grid grid-cols-3 gap-3">
            {allArticles
              .filter((workArticles) =>
                workArticles.field_tags.some(
                  (field_tag) => field_tag?.name === "Drupal",
                ),
              )
              .sort(
                (a, b) =>
                  new Date(b.created).getTime() - new Date(a.created).getTime(),
              )
              .slice(0, 3)
              .map((workArticle) => (
                <WorkArticleCard
                  key={workArticle.id}
                  workArticle={workArticle}
                />
              ))}
          </div>
        </div>
      ) : null}

      {currentWorkPage.title === "Traficom.fi" ||
      currentWorkPage.title === "Nelonen Media Partnership" ? (
        <div className="mt-20">
          <h1 className="uppercase text-main font-bold text-lg mb-4">
            {t("related-content")}
          </h1>
          <div className="md:grid grid-cols-3 gap-3">
            {allArticles
              .filter((workArticles) =>
                workArticles.field_tags.some(
                  (field_tag) => field_tag?.name === "Next.js",
                ),
              )
              .sort(
                (a, b) =>
                  new Date(b.created).getTime() - new Date(a.created).getTime(),
              )
              .slice(0, 3)
              .map((workArticle) => (
                <WorkArticleCard
                  key={workArticle.id}
                  workArticle={workArticle}
                />
              ))}
          </div>
        </div>
      ) : null}
    </>
  ) : (
    <NotFoundPage />
  );
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths = await drupal.getStaticPathsFromContext("node--page", context);
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<WorkPageProps> = async (
  context,
) => {
  const path: DrupalTranslatedPath = await drupal.translatePathFromContext(
    context,
    { pathPrefix: "/work" },
  );

  if (!path) {
    return {
      notFound: true,
    };
  }

  const type = path.jsonapi.resourceName as ResourceType;

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: getNodePageJsonApiParams(type).getQueryObject(),
    },
  );

  const nodeTranslations = await getNodeTranslatedVersions(
    resource,
    context,
    drupal,
  );

  const languageLinks = createLanguageLinks(nodeTranslations);

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }

  const pages = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--page",
    context,
    {
      params: getNodePageJsonApiParams("node--page")
        .addFilter("field_page_type.name", "Work")
        .getQueryObject(),
    },
  );

  const articles = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: getNodePageJsonApiParams("node--article").getQueryObject(),
    },
  );

  const numbers = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--numbers",
    context,
    {
      params: getNodePageJsonApiParams("node--numbers").getQueryObject(),
    },
  );

  return {
    props: {
      ...(await getCommonPageProps(context)),
      currentWorkPage: validateAndCleanupPage(resource),
      allWorkPages: pages.map((node) => validateAndCleanupPage(node)),
      allArticles: articles.map((node) => validateAndCleanupArticle(node)),
      numbers: numbers.map((node) => validateAndCleanupNumbers(node)),
      languageLinks,
    },
    revalidate: 60,
  };
};
