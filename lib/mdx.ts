import fs from "fs/promises"
import path from "path"
import { existsSync } from "fs"
import matter from "gray-matter"

interface WorkFrontmatter {
  title: string
  date?: string
  authors?: string[]
  excerpt?: string
  [key: string]: unknown
}

interface WorkData extends WorkFrontmatter {
  slug: string
  content: string
}

export async function getAllWorkSlugs(locale: string): Promise<string[]> {
  try {
    const localeDir = path.join(process.cwd(), "content/works", locale)
    if (!existsSync(localeDir)) {
      console.warn(`Directory does not exist, cannot get slugs: ${localeDir}`)
      return []
    }
    const files = await fs.readdir(localeDir)
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""))
  } catch (error) {
    console.error("Error getting work slugs:", error)
    return []
  }
}

export async function getWorkBySlug(
  slug: string,
  locale: string,
): Promise<WorkData | null> {
  try {
    const filePath = path.join(process.cwd(), "content/works", locale, `${slug}.mdx`)
    if (!existsSync(filePath)) {
      console.error(`Work file does not exist: ${filePath}`)
      return null
    }
    const source = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(source)

    return {
      slug,
      content,
      ...(data as WorkFrontmatter),
    }
  } catch (error) {
    console.error(`Error getting work ${slug}:`, error)
    return null
  }
}

export interface WorkMeta {
  slug: string
  title: string
  date: string
  authors?: string[]
  excerpt?: string
}

export async function getLatestWorks(
  locale: string,
  limit = 3,
): Promise<WorkMeta[]> {
  try {
    const localeDir = path.join(process.cwd(), "content/works", locale)
    if (!existsSync(localeDir)) {
      console.warn(`Directory does not exist, cannot get latest works: ${localeDir}`)
      return []
    }
    const files = await fs.readdir(localeDir)

    const worksPromises = files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file): Promise<WorkMeta | null> => {
        const slug = file.replace(/\.mdx$/, "")
        const filePath = path.join(localeDir, file)
        const source = await fs.readFile(filePath, "utf8")
        const { data } = matter(source)

        if (!data.date || typeof data.date !== 'string') {
            console.warn(`Work "${slug}" in locale "${locale}" is missing a valid date. Skipping.`);
            return null;
        }

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date,
          authors: data.authors || [],
          excerpt: data.excerpt || "",
        }
      })

    const worksWithNull = await Promise.all(worksPromises)
    const works = worksWithNull.filter((work): work is WorkMeta => work !== null)

    const sortedWorks = works.sort((a, b) => {
      try {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        if (isNaN(dateA)) return 1
        if (isNaN(dateB)) return -1
        return dateB - dateA
      } catch (e) {
        console.error("Error parsing date for sorting:", a.date, b.date, e)
        return 0
      }
    })

    return sortedWorks.slice(0, limit)
  } catch (error) {
    console.error("Error getting latest works:", error)
    return []
  }
}

export async function getAllWorks(locale: string): Promise<WorkMeta[]> {
  if (locale === 'favicon.ico') {
    return [];
  }
  try {
    const localeDir = path.join(process.cwd(), "content/works", locale)
    if (!existsSync(localeDir)) {
      console.warn(`Directory does not exist, cannot get all works: ${localeDir}`)
      return []
    }
    const files = await fs.readdir(localeDir)

    const worksPromises = files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file): Promise<WorkMeta | null> => {
        const slug = file.replace(/\.mdx$/, "")
        const filePath = path.join(localeDir, file)
        const source = await fs.readFile(filePath, "utf8")
        const { data } = matter(source)

        if (!data.date || typeof data.date !== 'string') {
            console.warn(`Work "${slug}" in locale "${locale}" is missing a valid date. Skipping.`);
            return null;
        }

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date,
          authors: data.authors || [],
          excerpt: data.excerpt || "",
        }
      })

    const worksWithNull = await Promise.all(worksPromises)
    const works = worksWithNull.filter((work): work is WorkMeta => work !== null)

    return works.sort((a, b) => {
      try {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        if (isNaN(dateA)) return 1
        if (isNaN(dateB)) return -1
        return dateB - dateA
      } catch (e) {
        console.error("Error parsing date for sorting:", a.date, b.date, e)
        return 0
      }
    })
  } catch (error) {
    console.error("Error getting works:", error)
    return []
  }
}
