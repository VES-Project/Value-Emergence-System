import "server-only"

export interface Dictionary {
  header: {
    home: string
    concepts: string
    works: string
  }
  footer: {
    copyright: string
  }
  home: {
    hero: {
      title: string
    }
    concepts: {
      items: Array<{
        title: string
        description: string
        icon: string
      }>
    }
    latestWorks: {
      viewAll: string
    }
    joinButtonText: string
  }
  works: {
    title: string
    empty: string
    readMore: string
    authors: string
  }
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
}

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const dict = dictionaries[locale] || dictionaries.ja
  return dict()
}
