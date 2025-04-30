"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Check } from "lucide-react"

interface CitationProps {
  title: string
  authors: string[]
  date: string
  journal?: string
  doi?: string
  url?: string
  lang: string
  dict: { citationPrefix: string }
}

export function Citation({ title, authors, date, journal, doi, url, lang, dict }: CitationProps) {
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState<"apa" | "mla" | "harvard" | "chicago">("apa")

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formattedDate = formatDate(date)
  const year = new Date(date).getFullYear()

  const getFormattedCitation = () => {
    const authorString = authors.join(", ")
    const today = new Date()
    const formattedAccessDate = today.toLocaleDateString(lang === "ja" ? "ja-JP-u-ca-japanese" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const accessDateString = url ? (lang === "ja" ? `, 取得日 ${formattedAccessDate}` : `, Accessed ${formattedAccessDate}`) : ""
    const prefixedTitle = `${dict.citationPrefix}${title}`

    switch (format) {
      case "apa":
        return lang === "ja"
          ? `${authorString}. (${year}). ${prefixedTitle}. ${journal ? `${journal}. ` : ""}${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}`
          : `${authorString}. (${year}). ${prefixedTitle}. ${journal ? `${journal}, ` : ""}${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}`
      case "mla":
        return lang === "ja"
          ? `${authorString}. 『${prefixedTitle}』. ${formattedDate}. ${journal ? `${journal}. ` : ""}${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
          : `${authorString}. "${prefixedTitle}." ${journal ? `${journal}, ` : ""}${formattedDate}, ${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
      case "harvard":
        return lang === "ja"
          ? `${authorString} (${year}) 『${prefixedTitle}』, ${journal ? `${journal}, ` : ""}${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
          : `${authorString} (${year}) '${prefixedTitle}', ${journal ? `${journal}, ` : ""}${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
      case "chicago":
        return lang === "ja"
          ? `${authorString}. 『${prefixedTitle}』. ${journal ? `${journal}, ` : ""}${formattedDate}. ${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
          : `${authorString}. "${prefixedTitle}." ${journal ? `${journal}, ` : ""}${formattedDate}. ${doi ? `https://doi.org/${doi}` : url || ""}${accessDateString}.`
      default:
        return ""
    }
  }

  const citation = getFormattedCitation()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatLabels = {
    ja: {
      cite: "引用",
      copyText: "引用をコピー",
      copiedText: "コピーしました",
      title: "引用形式",
      formats: {
        apa: "APA形式",
        mla: "MLA形式",
        harvard: "ハーバード形式",
        chicago: "シカゴ形式",
      },
    },
    en: {
      cite: "Cite",
      copyText: "Copy Citation",
      copiedText: "Copied",
      title: "Citation Format",
      formats: {
        apa: "APA Style",
        mla: "MLA Style",
        harvard: "Harvard Style",
        chicago: "Chicago Style",
      },
    },
  }

  const labels = formatLabels[lang as keyof typeof formatLabels] || formatLabels.ja

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          {labels.cite}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            {(["apa", "mla", "harvard", "chicago"] as const).map((f) => (
              <Button key={f} variant={format === f ? "default" : "outline"} size="sm" onClick={() => setFormat(f)}>
                {labels.formats[f]}
              </Button>
            ))}
          </div>
          <div className="relative">
            <div className="bg-muted p-3 rounded-md text-sm">{citation}</div>
            <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied ? labels.copiedText : labels.copyText}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
