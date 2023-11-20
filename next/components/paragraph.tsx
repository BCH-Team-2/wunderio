import dynamic from "next/dynamic";

import { ParagraphFileAttachments } from "@/components/paragraph--file-attachments";
import { ParagraphHero } from "@/components/paragraph--hero";
import { ParagraphImage } from "@/components/paragraph--image";
import { ParagraphLinks } from "@/components/paragraph--links";
import { ParagraphListingArticles } from "@/components/paragraph--listing-articles";
import { ParagraphText } from "@/components/paragraph--text";
import { Paragraph } from "@/lib/zod/paragraph";

import { ParagraphTestimonials } from "./paragraph--testimonials";
import { ParagraphHeadingSection } from "@/components/paragraph--heading-section";
import { ParagraphLinkService } from "./paragraph--link-service";
import { ParagraphLabelledImage } from "./paragraph--labelled-image";
// import { ParagraphServicesTaxonomy } from "./paragraph--services-taxonomy";

// Use dynamic imports to defer loading a component until after initial page load: https://nextjs.org/docs/advanced-features/dynamic-import
const ParagraphVideo = dynamic(() =>
  import("./paragraph--video").then((mod) => mod.ParagraphVideo),
);

const ParagraphAccordion = dynamic(() =>
  import("./paragraph--accordion").then((mod) => mod.ParagraphAccordion),
);

export function Paragraph({ paragraph }: { paragraph: Paragraph }) {
  if (!paragraph) {
    return null;
  }

  switch (paragraph.type) {
    case "paragraph--formatted_text": {
      return <ParagraphText paragraph={paragraph} />;
    }
    case "paragraph--links": {
      return <ParagraphLinks paragraph={paragraph} />;
    }
    case "paragraph--image": {
      return <ParagraphImage paragraph={paragraph} />;
    }
    case "paragraph--video": {
      return <ParagraphVideo paragraph={paragraph} />;
    }
    case "paragraph--accordion": {
      return <ParagraphAccordion paragraph={paragraph} />;
    }
    case "paragraph--hero": {
      return <ParagraphHero paragraph={paragraph} />;
    }
    case "paragraph--listing_articles": {
      return <ParagraphListingArticles paragraph={paragraph} />;
    }
    case "paragraph--file_attachments": {
      return <ParagraphFileAttachments paragraph={paragraph} />;
    }
    case "paragraph--testimonials": {
      return <ParagraphTestimonials paragraph={paragraph} />;
    }
    case "paragraph--heading_section": {
      return <ParagraphHeadingSection paragraph={paragraph} />
    }
    case "paragraph--labelled_image": {
      return <ParagraphLabelledImage paragraph={paragraph} />
    }
 
    default:
      return null;
  }
}
