import { getDictionary } from "@/lib/dictionaries";
// Remove getAllPresentations import
// import { getAllPresentations } from "@/lib/mdx";
import { Metadata } from "next";
// Remove PresentationCard import if no longer used directly on this page
// import { PresentationCard } from "@/components/presentations/presentation-card";
import { PresentationCarousel } from "@/components/presentations/presentation-carousel"; // Import the carousel
// Import the manifest directly
import { presentationsManifest } from "@/content/presentations/manifest";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);
  return {
    title: "Presentations",
    description: dict.presentations.pageDescription,
  };
}

export default async function ConceptsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang);
  // Get presentations directly from the manifest
  const presentations = presentationsManifest.filter((p) => p.published);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 text-center">
        Presentations
      </h1>
      <p className="text-lg text-muted-foreground mb-12 text-center">
        {dict.presentations.pageDescription}
      </p>

      {presentations.length > 0 ? (
        // Pass the manifest data directly to the carousel
        <PresentationCarousel presentations={presentations} lang={lang} />
      ) : (
        <p className="text-center text-muted-foreground">
          No presentations available yet.
        </p>
      )}
    </div>
  );
}
