import clsx from "clsx";

import { FormattedText } from "@/components/formatted-text";
import { HeadingParagraph } from "@/components/heading--paragraph";
import { FormattedText as FormattedTextType } from "@/lib/zod/paragraph";

export function ParagraphText({ paragraph }: { paragraph: FormattedTextType }) {
  return (
    <>
      {paragraph.field_heading && (
        <HeadingParagraph>{paragraph.field_heading}</HeadingParagraph>
      )}
      <div
        dangerouslySetInnerHTML={{
          __html: paragraph.field_formatted_text.processed,
        }}
        className="mt-6 font-serif text-xl leading-loose prose"
      />
      {/* <FormattedText
        html={paragraph.field_formatted_text.processed}
        className={clsx(
          "text-left text-md/xl text-scapaflow sm:text-lg",
          paragraph.field_heading && "mt-4",
        )}
      /> */}
    </>
  );
}
