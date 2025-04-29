"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react' // Embla Carouselフックと型をインポート
import React, { useCallback, useEffect, useState, useRef } from "react" // React Hooksをインポート
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll"; // アニメーションフックをインポート

// Define the type for a single work
// Update prop name from publications to works
interface Work {
  slug: string
  title: string
  date: string
  excerpt?: string // excerpt をオプショナルに変更
  authors?: string[] // authors もオプショナルに変更
}

// Rename component from LatestPublications to LatestWorks
export function LatestWorks({
  title,
  works, // Update prop name
  viewAllText,
  lang,
  readMoreText,
}: {
  title: string
  works: Work[] // Update prop type
  viewAllText: string
  lang: string
  readMoreText: string
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', slidesToScroll: 1 })
  const [selectedIndex, setSelectedIndex] = useState(0);
  const emblaNodeRef = useRef<HTMLDivElement>(null); // カルーセル要素への参照用 Ref
  const lastWheelTimeRef = useRef<number>(0); // 最後にホイール処理した時刻を記録する Ref
  const wheelThrottleDelay = 100; // ホイールイベントのスロットリング間隔を 100ms に変更

  // アニメーション用のフックを呼び出す
  const { ref: sectionRef, isVisible: isSectionVisible } = useAnimateOnScroll();

  // カルーセルの選択状態が変化したときにselectedIndexを更新
  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return; // emblaApi が undefined の場合のガード
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  // emblaApiの準備ができてからイベントリスナーを登録
  useEffect(() => {
    if (emblaApi) {
      onSelect(emblaApi); // 初期選択状態を設定
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect); // リサイズ時などにも対応
    }
    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
      }
    };
  }, [emblaApi, onSelect]);

  // ホイールイベントを処理する useEffect
  useEffect(() => {
    if (!emblaApi || !emblaNodeRef.current) return;

    const emblaNode = emblaNodeRef.current; // RefからDOMノードを取得

    const handleWheel = (event: WheelEvent) => {
      const currentTime = Date.now();
      // 前回のホイール処理から指定した時間経過していなければ処理を中断
      if (currentTime - lastWheelTimeRef.current < wheelThrottleDelay) {
         // preventDefault は常に呼び出してページのスクロールは止める
        event.preventDefault();
        return;
      }

      // スロットリングの条件を満たした場合のみスクロール処理を実行
      lastWheelTimeRef.current = currentTime; // 最終処理時刻を更新
      event.preventDefault();

      // ホイール方向によって前後のスライドへ移動
      const wheelRotation = Math.sign(event.deltaY);
      if (wheelRotation < 0) {
        emblaApi.scrollPrev();
      } else if (wheelRotation > 0) {
        emblaApi.scrollNext();
      }
    };

    // イベントリスナーを追加 (passive: false で preventDefault を有効に)
    emblaNode.addEventListener('wheel', handleWheel, { passive: false });

    // クリーンアップ関数
    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener('wheel', handleWheel);
      }
    };
  }, [emblaApi]); // emblaApi が利用可能になったら実行

  return (
    // アニメーション用の ref とクラスを section 要素に追加
    <section
      id="latest-works" // id を追加
      ref={sectionRef} // ref を設定
      className={cn(
        "py-12 overflow-hidden transition-all duration-700 ease-out", // 共通スタイルとトランジション
        isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10" // 表示/非表示スタイル
      )}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          {/* Update link path */}
          <Button variant="outline" asChild>
            <Link href={`/${lang}/works`}>{viewAllText}</Link>
          </Button>
        </div>

        {/* Embla Carouselのラッパーに ref を渡す */}
        <div className="embla relative" ref={emblaNodeRef}> {/* Refを適用 */}
          <div className="embla__viewport" ref={emblaRef}> {/* emblaRef は viewport に適用 */}
            {/* 3D効果のための視点設定 */}
            <div className="embla__container flex" style={{ perspective: '1000px' }}>
              {works.map((work, index) => (
                // スライドの基本スタイルと間隔
                <div key={work.slug} className="embla__slide flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 pl-4 relative">
                   {/* スライドごとのスタイル（回転と奥行き） - selectedIndexに基づいて計算 */}
                  <Card
                    className="flex flex-col h-full transition-transform duration-500 ease-out" // duration 500ms に戻す（調整はお好みで）
                    style={{
                      transformOrigin: 'center bottom', // 回転の中心を少し下に
                      transform: `
                        perspective(1000px)
                        rotateY(${(index - selectedIndex) * -35}deg) /* 回転角度を大きく */
                        translateZ(${Math.abs(index - selectedIndex) * -80}px) /* 奥行きは少し浅めに */
                        translateX(${(index - selectedIndex) * 25}%) /* 横移動を大きくして重なりを増やす */
                        scale(${1 - Math.abs(index - selectedIndex) * 0.15}) /* 縮小率を上げる */
                      `,
                      opacity: Math.abs(index - selectedIndex) < 2 ? 1 : 0.3, // 中央付近以外はより透明に
                      zIndex: works.length - Math.abs(index - selectedIndex), // 重なり順を明確に
                    }}
                  >
                    <CardHeader>
                      <CardTitle>
                        {/* Update link path */}
                        <Link href={`/${lang}/works/${work.slug}`} className="block">
                          <h3 className="text-lg font-semibold mb-1 group-hover:underline">
                            {work.title}
                          </h3>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500 mb-2">{work.date}</p>
                      <p className="text-gray-600">{work.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-2 flex-wrap"> {/*著者名が長い場合に折り返すように flex-wrap を追加 */}
                          {/* オプショナルチェイニング (?.) を使用 */}
                          {work.authors?.map((author, i) => (
                            <span key={i} className="text-sm text-gray-600">
                              {author}
                              {/* authors が存在する場合、length も安全にアクセスできる */}
                              {work.authors && i < work.authors.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                        {/* Button asChild を Link に変更し、buttonVariants を適用 */}
                        <Link
                          href={`/${lang}/works/${work.slug}`}
                          className={cn(
                            buttonVariants({ variant: "link" }),
                            "px-0 whitespace-nowrap" // 追加のスタイルは維持
                          )}
                        >
                          {readMoreText}
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          {/* 必要であればナビゲーションボタンを追加 */}
        </div>
      </div>
    </section>
  )
}
