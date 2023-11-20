import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { DrupalNode, DrupalTranslatedPath } from "next-drupal";
import { useTranslation } from "next-i18next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LayoutProps } from "@/components/layout";
import { Meta } from "@/components/meta";
import { Paragraph } from "@/components/paragraph";
import { Webform } from "@/components/webform";
import { createLanguageLinks } from "@/lib/contexts/language-links-context";
import { absoluteUrl } from "@/lib/drupal/absolute-url";
import { drupal } from "@/lib/drupal/drupal-client";
import {
  getNodePageJsonApiParams,
  ResourceType,
} from "@/lib/drupal/get-node-page-json-api-params";
import { getNodeTranslatedVersions } from "@/lib/drupal/get-node-translated-versions";
import { getCommonPageProps } from "@/lib/get-common-page-props";
import {
  Events as EventType,
  SideEvent as SideEventType,
  SideEvents as SideEventsType,
  validateAndCleanupEvents,
  validateAndCleanupSideEvents,
} from "@/lib/zod/events";
import { HeadingSection } from "@/lib/zod/paragraph";
import {
  validateAndCleanupWebform,
  validateAndCleanupWebformFields,
  Webform as WebformType,
} from "@/lib/zod/webform";

import NotFoundPage from "../404";

interface EventProps extends LayoutProps {
  event: EventType | SideEventType;
  webform: WebformType;
  sideEvents: SideEventsType;
}

const RESOURCE_TYPES = ["node--event", "node--side_event"];

export default function Event({
  event,
  webform,
  sideEvents,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log("webform", webform);
  const { t } = useTranslation();
  if (!event) {
    return <NotFoundPage />;
  }

  const breadcrumbs = [
    {
      title: t("homepage-link"),
      url: "/",
    },
    {
      title: t("events-link"),

      url: "/events",
    },
    {
      title: event.title,
      url: "/events/" + event.title,
    },
  ];
  // Add main event to breadcrumbs if this is a side event
  if (event.type === "node--side_event") {
    breadcrumbs.splice(breadcrumbs.length - 1, 0, {
      title: event.field_main_event.title,
      url: event.field_main_event.path.alias,
    });
  }

  const headingSection = event.field_content_elements.find(
    (element) => element.type === "paragraph--heading_section",
  ) as HeadingSection;
  return (
    <>
      <Meta title={event.title} metatags={event.metatag} />
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <div className="flex h-[100px] bg-primary-400/40 justify-between">
        <h1>{headingSection.field_heading}</h1>
        <span>{headingSection.field_excerpt}</span>
      </div>
      {
        <div
          dangerouslySetInnerHTML={{ __html: event.body.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      }
      <Webform webform={webform} />
      <div className="flex gap-4 flex-wrap">
        {sideEvents.length > 0 &&
          sideEvents.map((sideEvent) => (
            <Link
              key={sideEvent.id}
              href={sideEvent.path.alias}
              className="relative grid h-full rounded border border-finnishwinter bg-white p-4 transition-all hover:shadow-md"
            >
              <div className="p-4 w-52 h-52 rounded-md shadow-sm bg-primary-50">
                <h3>{sideEvent.title}</h3>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths = await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context);
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<EventProps> = async (context) => {
  const path: DrupalTranslatedPath = await drupal.translatePathFromContext(
    context,
    {
      pathPrefix: "/events",
    },
  );

  if (!path) {
    return {
      notFound: true,
    };
  }

  const type = path.jsonapi.resourceName as ResourceType;

  let resource;
  let validatedResource;
  let sideEvents = [];
  let validatedWebform;

  if (type === "node--event") {
    resource = await drupal.getResourceFromContext<DrupalNode>(path, context, {
      params: getNodePageJsonApiParams("node--event").getQueryObject(),
    });
    if (!resource) {
      throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
    }
    validatedResource = validateAndCleanupEvents(resource);
    // Fetch side events
    sideEvents = await drupal
      .getResourceCollectionFromContext<DrupalNode[]>(
        "node--side_event",
        context,
        {
          params: getNodePageJsonApiParams("node--side_event")
            .addFilter("field_main_event.id", resource.id)
            .getQueryObject(),
        },
      )
      .then((sideEvents) =>
        sideEvents.map(validateAndCleanupSideEvents).filter(Boolean),
      );
    // Fetch webform fields for event registration
    const webformFields = await fetch(
      absoluteUrl(
        `/webform_rest/${validatedResource.field_event_registration.resourceIdObjMeta.drupal_internal__target_id}/fields?_format=json`,
      ),
    )
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.log(error));
    console.log("webformFields", webformFields)
    validatedWebform = validateAndCleanupWebform(
      resource.field_event_registration,
    );
    const validatedWebformFields =
      validateAndCleanupWebformFields(webformFields);
    if (!validatedWebform || !validatedWebformFields) {
      throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
    }
    validatedWebform.field_webform_fields = validatedWebformFields;
  } else {
    resource = await drupal.getResourceFromContext<DrupalNode>(path, context, {
      params: getNodePageJsonApiParams("node--side_event").getQueryObject(),
    });
    if (!resource) {
      throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
    }
    validatedResource = validateAndCleanupSideEvents(resource);
  }

  const nodeTranslations = await getNodeTranslatedVersions(
    resource,
    context,
    drupal,
  );

  const languageLinks = createLanguageLinks(nodeTranslations);

  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getCommonPageProps(context)),
      event: validatedResource,
      webform: validatedWebform,
      sideEvents,
      languageLinks,
    },
    revalidate: 60,
  };
};
