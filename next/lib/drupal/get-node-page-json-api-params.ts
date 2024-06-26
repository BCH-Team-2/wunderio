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
  | "node--numbers"
  | "node--office_locations"
  | "node--contact_us"
  | "node--venue"
  | "node--legal_document"
  | "node--contact_persons"
  | "node--logowall";

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
      "field_participant.field_personal_data.field_profile_picture",
      "field_venue",
      "field_tags",
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
        "field_careers_newsletter",
        "field_content_elements",
        "field_testimonials.field_content_elements",
        "field_testimonials, field_testimonials.field_content_elements.field_image.field_media_image",
      ])
      .addFields(resourceType, [
        "title",
        "field_content_elements",
        "field_careers_newsletter",
        "field_testimonials",
        "field_testimonials.field_content_elements",
        "metatag",
        "body",
      ]);
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
    apiParams.addInclude([
      "field_image",
      "uid",
      "field_tags",
      "uid.field_profile_picture",
    ]);
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
        "field_content_elements.field_video",
        "field_service_types",
      ])
      .addFields("node--services_page", [
        "title",
        "field_content_elements",
        "path",
        "status",
        "metatag",
        "field_service_types",
      ]);
  }
  if (resourceType === "node--numbers") {
    apiParams
      .addInclude(["field_numbers_type"])
      .addFields("node--numbers", [
        "uid",
        "title",
        "body",
        "field_num",
        "field_suffix",
        "field_text",
        "field_numbers_type",
      ]);
  }

  if (resourceType === "node--office_locations") {
    apiParams
      .addInclude(["uuid", "field_address_coordinates"])
      .addFields("node--office_locations", [
        "title",
        "path",
        "status",
        "metatag",
        "field_address_coordinates",
        "field_city",
        "field_country_name",
        "field_postal_code",
        "field_street_address",
      ]);
  }

  if (resourceType === "node--contact_us") {
    apiParams
      .addInclude(["uid", "field_content_elements, field_contact_us_form"])
      .addFields("node--contact_us", [
        "title",
        "metatag",
        "field_content_elements",
        "field_contact_us_form",
        "field_contact_people",
      ]);
  }
  if (resourceType === "node--venue") {
    apiParams
      .addInclude(["uid", "field_venue_coordinates"])
      .addFields("node--office_locations", [
        "title",
        "metatag",
        "field_venue_coordinates",
        "field_venue_address",
      ]);
  }
  if (resourceType === "node--legal_document") {
    apiParams.addFields("node--legal_document", ["title", "body", "metatag"]);
  }

  if (resourceType === "node--contact_persons") {
    apiParams
      .addInclude(["field_image"])
      .addFields("node--contact_persons", [
        "uid",
        "title",
        "metatag",
        "field_image",
        "field_full_name",
        "field_excerpt",
        "field_contact_email",
        "field_contact_phone",
      ]);
  }

  if (resourceType === "node--logowall") {
    apiParams
      .addFields("node--logowall", [
        "title",
        "field_image",
        "field_field_link_client_site",
        "metatag",
      ])
      .addInclude(["field_image"]);
  }

  if (resourceType === "node--about_us") {
    apiParams
      .addInclude([
        "field_content_elements",
        "field_content_elements.field_image.field_media_image",
      ])
      .addFields("node--about_us", [
        "title",
        "field_content_elements",
        "path",
        "body",
        "status",
        "metatag",
      ]);
  }

  return apiParams;
}
