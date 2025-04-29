import fs from "fs/promises"
import path from "path"
import { existsSync } from "fs"
import matter from "gray-matter"

const locales = ["en", "ja"]

export async function getMarkdownContent(slug: string, locale: string) {
  try {
    const filePath = path.join(process.cwd(), "content", locale, `${slug}.mdx`)

    if (!existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`)
      return {
        content: "Content Not Found: File does not exist",
        frontmatter: { title: "Not Found" },
      }
    }

    const source = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(source)

    return {
      content,
      frontmatter: data,
    }
  } catch (error) {
    console.error(`Error loading markdown content for ${slug} in ${locale}:`, error)
    return {
      content: `Content Not Found: ${String(error)}`,
      frontmatter: { title: "Not Found" },
    }
  }
}

export async function getAllArticleSlugs(locale: string): Promise<string[]> {
  try {
    const localeDir = path.join(process.cwd(), "content/articles", locale)
    const files = await fs.readdir(localeDir)
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""))
  } catch (error) {
    console.error("Error getting article slugs:", error)
    return []
  }
}

export async function getArticleBySlug(slug: string, locale: string) {
  try {
    const filePath = path.join(process.cwd(), "content/articles", locale, `${slug}.mdx`)
    const source = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(source)

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
      authors: data.authors || [],
      excerpt: data.excerpt || "",
    }
  } catch (error) {
    console.error(`Error getting article ${slug}:`, error)
    return null
  }
}

export async function getLatestArticles(locale: string, limit = 3) {
  if (!locales.includes(locale)) {
    console.warn(`Invalid locale passed to getLatestArticles: ${locale}`);
    return []
  }

  try {
    const localeDir = path.join(process.cwd(), "content/articles", locale)
    const files = await fs.readdir(localeDir)

    const articles = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, "")
          const filePath = path.join(localeDir, file)
          const source = await fs.readFile(filePath, "utf8")
          const { data } = matter(source)

          return {
            slug,
            title: data.title,
            date: data.date,
            authors: data.authors || [],
            excerpt: data.excerpt || "",
          }
        }),
    )

    const sortedArticles = articles.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return sortedArticles.slice(0, limit)
  } catch (error) {
    console.error("Error getting latest articles:", error)
    return []
  }
}

export async function getAllArticles(locale: string) {
  try {
    const localeDir = path.join(process.cwd(), "content/articles", locale)
    const files = await fs.readdir(localeDir)

    const articles = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, "")
          const filePath = path.join(localeDir, file)
          const source = await fs.readFile(filePath, "utf8")
          const { data } = matter(source)

          return {
            slug,
            title: data.title,
            date: data.date,
            authors: data.authors || [],
            excerpt: data.excerpt || "",
          }
        }),
    )

    return articles.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error("Error getting articles:", error)
    return []
  }
}
