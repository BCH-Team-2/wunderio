import { LegalDocument } from "@/lib/zod/legal-document";

import { FormattedText } from "./formatted-text";
import { HeadingPage } from "./heading--page";
import { Meta } from "./meta";

interface LegalDocumentProps {
  legal_document: LegalDocument;
}

export default function LegalDocument({ legal_document }: LegalDocumentProps) {
  return (
    <>
      <Meta title={legal_document.title} metatags={legal_document.metatag} />
      <HeadingPage title={legal_document.title} />
      <FormattedText html={legal_document.body.processed} />
    </>
  );
}
