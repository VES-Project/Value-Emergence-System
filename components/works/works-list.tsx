import Link from "next/link"
import type { WorkMeta } from "@/lib/mdx"

export function WorksList({
  works,
  emptyText,
  lang,
  readMoreText,
}: {
  works: WorkMeta[]
  emptyText: string
  lang: string
  readMoreText: string
}) {
  if (!works || works.length === 0) {
    return <p>{emptyText}</p>
  }

  return (
    <div className="space-y-8">
      {works.map((work) => (
        <div key={work.slug} className="border-b pb-4">
          <h2 className="text-2xl font-semibold mb-2">
            <Link href={`/${lang}/works/${work.slug}`} className="hover:underline">
              <h3 className="text-lg font-semibold mb-1 group-hover:underline">{work.title}</h3>
            </Link>
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {work.date} {work.authors && work.authors.length > 0 && `| ${work.authors.join(", ")}`}
          </p>
          <p className="text-gray-700 mb-3">{work.excerpt}</p>
          <Link href={`/${lang}/works/${work.slug}`} className="hover:underline">
            {readMoreText}
          </Link>
        </div>
      ))}
    </div>
  )
}
