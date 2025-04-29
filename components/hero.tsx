'use client'

import type React from "react"
import { CellularAutomatonBackground } from "./cellular-automaton-background"
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll"; // アニメーションフックをインポート
import { cn } from "@/lib/utils"; // cn ユーティリティをインポート

export function Hero({
  title,
}: {
  title: string
}) {
  // アニメーション用のフックを呼び出す
  const { ref, isVisible } = useAnimateOnScroll();

  return (
    // アニメーション用の ref とクラスを適用
    <div
      ref={ref}
      className={cn(
        "min-h-screen flex flex-col items-center justify-center text-center", // 元のスタイル
        "transition-all duration-700 ease-out", // トランジションスタイル
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10", // 表示/非表示スタイル
        "bg-gradient-to-br from-hero-gradient-start to-hero-gradient-end" // グラデーションクラスを追加
      )}
    >
      {/* タイトル、オートマトン、ボタンを縦に並べる */}
      <div className="flex flex-col items-center w-full max-w-2xl mb-4"> {/* 幅を少し広げ、下マージン調整 */}
        {/* アイコン削除 */}
        {/* タイトルを中央揃え */}
        <h1 className="text-3xl md:text-5xl text-center mt-2 text-hero-foreground">{title}</h1> {/* text-hero-foregroundを使用 */}
      </div>

      <div className="relative h-48 w-full max-w-4xl mx-auto mb-10"> {/* ★ 下マージン追加 */} 
        <CellularAutomatonBackground />
      </div>

      {/* ★ ボタンを削除 */}
      {/* <Link href={buttonLink} target="_blank" rel="noopener noreferrer">
        <Button
          variant="gradient"
        >
          {buttonText}
        </Button>
      </Link> */}
    </div>
  )
}
