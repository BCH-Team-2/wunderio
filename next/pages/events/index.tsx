import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { DrupalNode } from "next-drupal";
import { useTranslation } from "next-i18next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import Events from "@/components/events";
import { HeadingPage } from "@/components/heading--page";
import { LayoutProps } from "@/components/layout";
import { Paragraph } from "@/components/paragraph";
import {
  createLanguageLinks,
  createLanguageLinksForNextOnlyPage,
} from "@/lib/contexts/language-links-context";
import { drupal } from "@/lib/drupal/drupal-client";
import { getNodePageJsonApiParams } from "@/lib/drupal/get-node-page-json-api-params";
import { getNodeTranslatedVersions } from "@/lib/drupal/get-node-translated-versions";
import { getCommonPageProps } from "@/lib/get-common-page-props";
import {
  Events as EventsType,
  validateAndCleanupEvents,
} from "@/lib/zod/events";

interface EventsPageProps extends LayoutProps {
  events: EventsType[];
}

export default function EventsPage({
  events,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const breadcrumbs = [
    {
      title: t("homepage-link"),
      url: "/",
    },
    {
      title: t("events-link"),
      url: "/events",
    },
  ];

  return (
    <>
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <HeadingPage>{t("events-main-title")}</HeadingPage>
      <Events events={events} />
    </>
  );
}

export const getStaticProps: GetStaticProps<EventsPageProps> = async (
  context,
) => {
  const events = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--event",
    context,
    {
      params: getNodePageJsonApiParams("node--event").getQueryObject(),
    },
  );

  const languageLinks = createLanguageLinksForNextOnlyPage("/events", context);
  return {
    props: {
      ...(await getCommonPageProps(context)),
      events: events.map((event) => validateAndCleanupEvents(event)),
      languageLinks,
    },
    revalidate: 60,
  };
};
