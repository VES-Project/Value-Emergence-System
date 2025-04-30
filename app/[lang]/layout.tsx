import type React from "react"
import "../globals.css"
import { ClientHeader } from "@/components/client-header"
import { Footer } from "@/components/footer"
import { getDictionary } from "@/lib/dictionaries"

export async function generateStaticParams() {
  return [{ lang: "ja" }, { lang: "en" }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <ClientHeader lang={lang} dictionary={dict.header} />
        <div className="relative flex-grow">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}
