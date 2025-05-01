import { getWorkBySlug, getAllWorkSlugs } from "@/lib/mdx"
import { MarkdownContent } from "@/components/mdx/markdown-content"
import { Citation } from "@/components/misc/citation"
import { WorkCloseButton } from "@/components/works/work-close-button"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/dictionaries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const work = await getWorkBySlug(slug, lang)

  if (!work) {
    return {}
  }

  return {
    title: work.title,
    description: work.excerpt,
  }
}

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const slugs = await getAllWorkSlugs(lang)
  return slugs.map((slug) => ({ lang, slug }))
}

export default async function WorkPage({
  params: initialParams,
}: {
  params: { lang: string; slug: string }
}) {
  const params = await initialParams;
  const { lang, slug } = params
  const dict = await getDictionary(lang)

  const work = await getWorkBySlug(params.slug, params.lang)

  if (!work) {
    notFound()
  }

  return (
    <div className="relative bg-neutral-950 p-4 md:p-8 max-w-screen-lg mx-auto">
      <WorkCloseButton />

      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 shadow-xl mt-12 md:mt-16">
        <div className="flex justify-end mt-4 mb-6">
          <Citation
            title={work.title}
            authors={work.authors ?? []}
            date={work.date ?? ""}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lang}/works/${slug}`}
            lang={lang}
            dict={{ citationPrefix: dict.citationPrefix }}
          />
        </div>
        <MarkdownContent content={work.content} />
      </div>
    </div>
  )
}
