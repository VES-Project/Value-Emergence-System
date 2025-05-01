import type React from "react"
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 md:px-8 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-700">
            © {currentYear} VES Project |{' '}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:underline"
            >
              CC BY 4.0
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
