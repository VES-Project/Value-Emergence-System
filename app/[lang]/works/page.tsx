import { getDictionary } from "@/lib/dictionaries"
import { PageHeader } from "@/components/page-header"
import { WorksList } from "@/components/works-list"
import { getAllWorks } from "@/lib/mdx"

export default async function WorksPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const works = await getAllWorks(lang)

  return (
    <div>
      <PageHeader title={"Works"} />
      <WorksList
        works={works}
        emptyText={dict.works.empty}
        lang={lang}
        readMoreText={dict.works.readMore}
      />
    </div>
  )
}
