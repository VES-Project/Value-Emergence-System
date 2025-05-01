import { getDictionary } from "@/lib/dictionaries";
import { Metadata } from "next";
import { getAllConceptSlides } from "@/lib/mdx";
import { ConceptSlider } from "@/components/concepts/concept-slider";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.citationPrefix}Concepts`,
  };
}

export default async function ConceptsPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const slides = await getAllConceptSlides(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-8">
        Concepts
      </h1>
      {slides.length > 0 ? (
        <ConceptSlider slides={slides} />
      ) : (
        <p>コンセプトのスライドが見つかりません。</p>
      )}
    </div>
  );
} 