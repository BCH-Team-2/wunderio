import { DrupalJsonApiParams } from "drupal-jsonapi-params";

import { env } from "@/env";

export type ResourceType =
  | "node--frontpage"
  | "node--page"
  | "node--article"
  | "node--careers"
  | "node--open_positions"
  | "node--event"
  | "node--side_event"
  | "node--about_us"
  | "node--work_main_page"
  | "node--services_page"
  | "node--numbers";

export function getNodePageJsonApiParams(resourceType: ResourceType) {
  const apiParams = new DrupalJsonApiParams().addFilter(
    "field_site.meta.drupal_internal__target_id",
    env.DRUPAL_SITE_ID,
  );

  if (resourceType === "node--side_event") {
    apiParams
      .addInclude(["uid", "field_main_event", "field_content_elements"])
      .addFields(resourceType, [
        "title",
        "path",
        "metatag",
        "field_content_elements",
        "field_main_event",
        "body",
      ]);
  }

  if (resourceType === "node--event") {
    apiParams.addInclude([
      "uid",
      "field_content_elements",
      "field_content_elements.field_image.field_media_image",
      "field_event_registration",
      "field_participant",
    ]);
    /*  .addFields(resourceType, [
        "title",
        "path",
        "field_content_elements",
        "metatag",
        "body",
      ]); */
  }

  if (resourceType === "node--careers") {
    apiParams
      .addInclude([
        "uid",
        "field_content_elements.field_image.field_media_image",
      ])
      .addFields(resourceType, ["title", "field_content_elements", "metatag"]);
  }

  if (resourceType === "node--open_positions") {
    apiParams.addInclude([
      "uid",
      "field_basic_info",
      "field_country",
      "field_office",
      "field_position",
      "field_position_image",
    ]);
  }

  // The page content type has paragraphs, stored in the "field_content_elements" field:
  if (resourceType === "node--page") {
    apiParams.addInclude([
      "field_content_elements",
      "field_content_elements.field_image.field_media_image",
      "field_content_elements.field_video",
      "field_content_elements.field_file_attachments.field_media_document",
      "field_content_elements.field_accordion_items",
      "field_content_elements.field_accordion_items.field_content_elements.field_image.field_media_image",
      "field_content_elements.field_accordion_items.field_content_elements.field_video",
      "field_page_type",
    ]);
    /*   .addFields("node--page", [
        "title",
        "field_content_elements",
        "path",
        "status",
        "metatag",
        "field_page_type",
      ]); */
  }

  // The frontpage content type has paragraphs, stored in the "field_content_elements" field:
  if (resourceType === "node--frontpage") {
    apiParams
      .addInclude([
        "field_content_elements",
        "field_content_elements.field_image.field_media_image",
        "field_content_elements.field_video",
        "field_content_elements.field_file_attachments.field_media_document",
        "field_content_elements.field_accordion_items",
        "field_content_elements.field_accordion_items.field_content_elements.field_image.field_media_image",
        "field_content_elements.field_accordion_items.field_content_elements.field_video",
      ])
      // Only published frontpages:
      .addFilter("status", "1")
      .addFields("node--frontpage", [
        "title",
        "field_content_elements",
        "metatag",
      ]);
  }

  // The article content type has an image field, and author information:
  if (resourceType === "node--article") {
    apiParams.addInclude(["field_image", "uid", "field_tags", "uid.field_profile_picture"]);
    apiParams.addFields(resourceType, [
      "title",
      "body",
      "uid",
      "uid.field_profile_picture",
      "created",
      "field_image",
      "status",
      "metatag",
      "field_excerpt",
      "path",
      "sticky",
      "field_tags",
    ]);
  }
  // The work content type has paragraphs, stored in the "field_content_elements" field:
  if (resourceType === "node--work_main_page") {
    apiParams
      .addInclude(["field_content_elements"])
      .addFields("node--work_main_page", [
        "title",
        "field_content_elements",
        "path",
        "status",
        "metatag",
      ]);
  }

  if (resourceType === "node--services_page") {
    apiParams
      .addInclude([
        "field_connect_services",
        "field_content_elements",
        "field_content_elements.field_image.field_media_image",
        "field_page_types",
        "field_service_types",
      ])
      .addFields("node--services_page", [
        "title",
        "field_content_elements",
        "path",
        "status",
        "metatag",
        "field_page_types",
        "field_service_types",
      ]);
  }
  if (resourceType === "node--numbers") {
    apiParams.addInclude([
      "field_numbers_type",
    ])
      .addFields("node--numbers", [
        "uid",
        "title",
        "body",
        "field_num",
        "field_suffix",
        "field_text",
        "field_numbers_type",
        "path",
      ])
  }

  return apiParams;
}
