import { getDictionary } from "@/lib/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.citationPrefix}Concepts`,
  };
}

export default async function ConceptsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-8">
        Concepts
      </h1>
      {/* TODO: Concepts の詳細コンテンツを追加 */}
      <p>{dict.concepts?.description || "詳細はこちらに表示されます。"}</p>
    </div>
  );
} 