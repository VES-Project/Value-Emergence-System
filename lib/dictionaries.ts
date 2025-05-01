import "server-only"

export interface Dictionary {
  citationPrefix: string;
  footer: {
    copyright: string
  }
  header: {
    participate: string
  }
  home: {
    concepts: {
      items: Array<{
        title: string
        description: string
        icon: string
        viewDetails: string
      }>
    }
    latestWorks: {
      viewAll: string
    }
    joinButtonText: string
  }
  works: {
    empty: string
    readMore: string
    authors: string
  }
  contributorsPage: {
    description: string
  }
  concepts?: {
    description: string;
  };
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
}

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const dict = dictionaries[locale] || dictionaries.ja
  return dict()
}
