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

// --- Contributor Types and Functions ---

interface ContributorFrontmatter {
  title: string // Name of the contributor
  date?: string // Date added or relevant date
  role?: string
  image?: string
  order?: number
  description?: string
  [key: string]: unknown // Allow other fields
}

export interface ContributorMeta {
  slug: string
  title: string // Name
  date?: string
  role?: string
  image?: string
  order?: number
  content: string // Keep content for potential detail page
  description?: string
}

export async function getAllContributors(locale: string): Promise<ContributorMeta[]> {
  if (locale === 'favicon.ico') {
    return [];
  }
  try {
    const localeDir = path.join(process.cwd(), "content/contributors", locale)
    if (!existsSync(localeDir)) {
      console.warn(`Contributor directory does not exist: ${localeDir}`)
      return []
    }
    const files = await fs.readdir(localeDir)

    const contributorsPromises = files
      .filter((file) => file.endsWith(".mdx") && file !== 'template.mdx')
      .map(async (file): Promise<ContributorMeta | null> => {
        const slug = file.replace(/\.mdx$/, "")
        const filePath = path.join(localeDir, file)
        try {
          const source = await fs.readFile(filePath, "utf8")
          const { data, content } = matter(source)
          const frontmatter = data as ContributorFrontmatter

          if (!frontmatter.title) {
            console.warn(`Contributor "${slug}" in locale "${locale}" is missing a title. Skipping.`);
            return null;
          }

          const order = typeof frontmatter.order === 'number' ? frontmatter.order : undefined;

          return {
            slug,
            title: frontmatter.title,
            date: frontmatter.date,
            role: frontmatter.role,
            image: frontmatter.image,
            order: order,
            content: content,
            description: frontmatter.description
          }
        } catch (readError) {
          console.error(`Error reading or parsing contributor file ${filePath}:`, readError);
          return null;
        }
      })

    const contributorsWithNull = await Promise.all(contributorsPromises)
    const contributors = contributorsWithNull.filter((c): c is ContributorMeta => c !== null)

    // Sort by order (ascending), then date (descending), then title (ascending)
    return contributors.sort((a, b) => {
      // Use MAX_SAFE_INTEGER for undefined order to place them last
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If order is the same or undefined, sort by date (descending)
      try {
        const dateA = a.date ? new Date(a.date).getTime() : -Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : -Infinity;
        if (!isNaN(dateA) && !isNaN(dateB)) {
          if (dateB !== dateA) return dateB - dateA;
        }
        // If dates are also the same or invalid, sort by title (ascending)
        return a.title.localeCompare(b.title);
      } catch (e) {
        console.error("Error parsing date/title for sorting contributors:", a, b, e)
        return 0
      }
    })
  } catch (error) {
    console.error("Error getting contributors:", error)
    return []
  }
}
