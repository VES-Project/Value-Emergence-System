import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Concepts",
  };
}

export default function ConceptsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-8">
        Concepts
      </h1>
      <p>このページは現在準備中です。</p>
    </div>
  );
} 