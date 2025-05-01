// import { getDictionary } from "@/lib/dictionaries"; // 未使用のためコメントアウト
import { Metadata } from "next";
// import { getAllConceptSlides } from "@/lib/mdx"; // 不要なインポートを削除
// import { ConceptSlider } from "@/components/concepts/concept-slider"; // 不要なインポートを削除

// export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> { // params を使わないので引数削除
export async function generateMetadata(): Promise<Metadata> { // ★ params を削除
  return {
    // title: `${dict.citationPrefix}Concepts`, // 辞書キーが存在しない場合があるため一旦コメントアウト
    title: "Concepts", // シンプルなタイトルに変更
  };
}

// export default async function ConceptsPage({ params }: { params: { lang: string } }) { // params を使わないので引数削除
export default function ConceptsPage() { // ★ params を削除
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-8">
        Concepts
      </h1>
      {/* スライダー表示部分を削除し、プレースホルダーテキストを追加 */}
      <p>このページは現在準備中です。</p>
    </div>
  );
} 