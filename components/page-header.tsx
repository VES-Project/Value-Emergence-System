export function PageHeader({
  title,
  description,
  date,
  authors,
}: {
  title: string
  description?: string
  date?: string
  authors?: string[]
}) {
  return (
    <div className="mb-8 border-b pb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

      {description && <p className="text-xl text-gray-600 mb-4">{description}</p>}

      {(date || authors) && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          {date && <div>{date}</div>}

          {authors && authors.length > 0 && <div>著者: {authors.join(", ")}</div>}
        </div>
      )}
    </div>
  )
}
