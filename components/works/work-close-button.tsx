"use client"

import { useParams } from "next/navigation"
import Link from 'next/link'

export function WorkCloseButton() {
  const { lang } = useParams<{ lang: string }>()

  return (
    <Link
      href={`/${lang}/works`}
      className="absolute top-4 left-4 md:top-8 md:left-8 z-50 h-8 w-8 text-white hover:text-gray-300 transition-colors"
      aria-label="Close" // Accessibility
    >
      <span className="block absolute h-0.5 w-full bg-current transform rotate-45 top-1/2 left-0"></span>
      <span className="block absolute h-0.5 w-full bg-current transform -rotate-45 top-1/2 left-0"></span>
    </Link>
  )
} 