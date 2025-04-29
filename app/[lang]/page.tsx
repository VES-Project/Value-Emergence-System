import { getDictionary } from "@/lib/dictionaries"
import { Hero } from "@/components/hero"
import { ConceptSection } from "@/components/concepts"
import { WorkCarousel } from "@/components/work-carousel"
import { getAllWorks } from "@/lib/mdx"

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
        <Hero 
          title={dict.home.hero.title} 
        />
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <ConceptSection title={dict.home.concepts.title} concepts={dict.home.concepts.items} />
      </div>

      <div id="latest-works" className="min-h-screen flex items-center justify-center">
        <WorkCarousel
          title={dict.home.latestWorks.title}
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
