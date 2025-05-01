'use client'

import Link from "next/link"
import { LanguageSwitcher } from "../common/language-switcher"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header({
  lang,
  dictionary,
}: {
  lang: string
  dictionary: {
    participate: string
  }
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <TooltipProvider>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href={`/${lang}`} className="font-bold text-lg">
              VES
            </Link>

            <nav className="hidden md:flex space-x-8 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://scrapbox.io/ves-project/" target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/round_robin.svg"
                      alt="Round Robin Icon"
                      width={20}
                      height={20}
                      className="transition-transform duration-200 hover:animate-wiggle"
                    />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dictionary.participate}</p>
                </TooltipContent>
              </Tooltip>
              <Link href={`/${lang}`} className="hover:underline">
                Home
              </Link>
              <Link href={`/${lang}#concepts`} className="hover:underline">
                Concepts
              </Link>
              <Link href={`/${lang}#works`} className="hover:underline">
                Works
              </Link>
              <Link href={`/${lang}/contributors`} className="hover:underline">
                Contributors
              </Link>
              <LanguageSwitcher currentLang={lang} />
            </nav>

            <div className="md:hidden flex items-center space-x-4">
              <LanguageSwitcher currentLang={lang} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4">
            <nav className="flex flex-col items-center space-y-4">
              <div className="flex items-center">
                <a href="https://scrapbox.io/ves-project/" target="_blank" rel="noopener noreferrer" className="mr-2">
                  <Image
                    src="/round_robin.svg"
                    alt="Round Robin Icon"
                    width={20}
                    height={20}
                    className="transition-transform duration-200 hover:animate-wiggle"
                  />
                </a>
              </div>
              <Link href={`/${lang}`} className="hover:underline" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href={`/${lang}#concepts`} className="hover:underline" onClick={() => setIsMenuOpen(false)}>
                Concepts
              </Link>
              <Link href={`/${lang}#works`} className="hover:underline" onClick={() => setIsMenuOpen(false)}>
                Works
              </Link>
              <Link href={`/${lang}/contributors`} className="hover:underline" onClick={() => setIsMenuOpen(false)}>
                Contributors
              </Link>
            </nav>
          </div>
        )}
      </header>
    </TooltipProvider>
  )
}
