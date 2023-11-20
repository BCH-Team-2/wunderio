import { Media } from "@/components/media";
import { Testimonials } from "@/lib/zod/paragraph";

import { FormattedText } from "./formatted-text";

export function ParagraphTestimonials({
  paragraph,
}: {
  paragraph: Testimonials;
}) {
  return (
    <div className="border-l-2 max-w-xs border-graysuit p-2 pl-4 flex gap-2 justify-between">
      <div className="rounded-full w-16 h-16 overflow-hidden">
        <Media media={paragraph.field_image} priority={true} />
      </div>
      <div className="flex flex-col justify-between text-right">
        <span className="text-graysuit text-sm">
          {paragraph.field_testimonial_person.processed}
        </span>
        <FormattedText html={paragraph.field_testimonial_text.processed} />
      </div>
    </div>
  );
}
