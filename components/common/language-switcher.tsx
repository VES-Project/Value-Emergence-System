"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = () => {
    const newLang = currentLang === "en" ? "ja" : "en"
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPathname)
  }

  return (
    <Button variant="ghost" size="sm" onClick={switchLanguage} className="flex items-center gap-1">
      <Globe className="h-4 w-4" />
      <span>{currentLang === "en" ? "日本語" : "English"}</span>
    </Button>
  )
}
