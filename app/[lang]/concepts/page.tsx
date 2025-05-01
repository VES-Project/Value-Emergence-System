import { getDictionary } from "@/lib/dictionaries";
import { getAllPresentations } from "@/lib/mdx";
import { Metadata } from "next";
import { PresentationCard } from "@/components/presentations/presentation-card";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);
  return {
    title: "Presentations",
    description: dict.presentations.pageDescription,
  };
}

export default async function ConceptsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang);
  const presentations = await getAllPresentations(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 text-center">
        Presentations
      </h1>
      <p className="text-lg text-muted-foreground mb-12 text-center">
        {dict.presentations.pageDescription}
      </p>

      {presentations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {presentations.map((presentation) => {
            return (
              <PresentationCard
                key={presentation.slug}
                lang={lang}
                presentation={presentation}
                title={presentation.title}
                description={presentation.description}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No presentations available yet.</p>
      )}
    </div>
  );
} 