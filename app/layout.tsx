import type React from "react"
import "./globals.css"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"
import { Noto_Serif_JP } from "next/font/google"
import type { Metadata } from "next"

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Value Emergence System",
  description: "Research on complex adaptive systems and value emergence",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* KaTeXフォントを直接読み込む */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Math-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Main-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Main-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta property="og:image" content="/ogp.png" />
      </head>
      <body className={notoSerifJP.className}>{children}</body>
    </html>
  )
}
