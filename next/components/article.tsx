import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { FormattedText } from "@/components/formatted-text";
import { HeadingPage } from "@/components/heading--page";
import { absoluteUrl } from "@/lib/drupal/absolute-url";
import { formatDate } from "@/lib/utils";
import { Article } from "@/lib/zod/article";

import { Breadcrumbs } from "./breadcrumbs";

interface ArticleProps {
  article: Article;
}

export function Article({ article, ...props }: ArticleProps) {
  const { t } = useTranslation();
  const router = useRouter();
  console.log("articlesmy", article);

  const breadcrumbs = [
    {
      //TODO: fix link and style ALL ARTICLES page
      title: t("all-articles-link"),
      url: "/all-articles",
    },
    {
      title: article.title,
      url: article.path.alias,
    },
  ];

  return (
    <article {...props}>
      <div className="container">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
      <HeadingPage title={article.title} />
      {article.field_excerpt && (
        <div className="my-4 text-xl">{article.field_excerpt}</div>
      )}
      <div className="mb-4 bg-primary-50 p-2 md:w-6/12 py-4 rounded-full">
        <div className="flex items-center ">

          <div className="w-[350px] m-auto">
            {article.uid?.display_name && (
              <span className="text-accent-hugs">
                {t("posted-by", { author: article.uid?.display_name })} -{" "}
              </span>
            )}
            <span className="text-accent-hugs">{formatDate(article.created, router.locale)}</span>
          </div>
        </div>
        {article.uid?.field_profile_picture?.uri && (
          <div className="w-[100px] m-auto my-2">
            <Image
              src={absoluteUrl(article.uid?.field_profile_picture?.uri.url)}
              width={100}
              height={100}
              layout="fixed"
              className="rounded-full w-20 h-20 mr-3"
              alt={article.uid?.field_profile_picture.resourceIdObjMeta.alt}
            />
          </div>
        )}
      </div>

      {article.field_image && (
        <figure>
          <Image
            src={absoluteUrl(article.field_image.uri.url)}
            width={768}
            height={480}
            style={{ width: 768, height: 480 }}
            alt={article.field_image.resourceIdObjMeta.alt}
            className="object-cover"
            priority
          />
          {article.field_image.resourceIdObjMeta.title && (
            <figcaption className="py-2 text-center text-sm text-scapaflow">
              {article.field_image.resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      {article.body?.processed && (
        <FormattedText
          className="mt-4 text-md/xl text-scapaflow sm:text-lg"
          html={article.body?.processed}
        />
      )}
    </article>
  );
}
