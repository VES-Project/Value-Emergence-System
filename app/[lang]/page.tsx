import { getDictionary } from "@/lib/dictionaries"
import { Hero } from "@/components/sections/hero-section"
import { ConceptSection } from "@/components/concepts/concept-section"
import { WorkCarousel } from "@/components/works/work-carousel"
import { getAllWorks } from "@/lib/mdx"
import type { ConceptItem } from "@/components/concepts/concept-section"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  const dict = await getDictionary(lang)
  const works = await getAllWorks(lang)

  return (
    <div>
      <div id="hero" className="min-h-screen flex flex-col items-center justify-center">
        <Hero />
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <ConceptSection
          concepts={dict.home.concepts.items as ConceptItem[]}
          lang={lang}
          viewDetailsText={dict.home.concepts['viewDetails']}
        />
      </div>

      <div id="works" className="min-h-screen flex items-center justify-center">
        <WorkCarousel
          works={works.map(work => ({
            ...work,
            authors: work.authors ?? [],
            excerpt: work.excerpt ?? '',
          }))}
          viewAllText={dict.home.latestWorks.viewAll}
          lang={lang}
          readMoreText={dict.works.readMore}
          authorsText={dict.works.authors}
        />
      </div>
    </div>
  )
}
