export interface PresentationManifestItem {
  slug: string;
  thumbnail?: string; // Optional thumbnail image filename (e.g., 'intro.png')
  published: boolean;
  // Add multilingual metadata
  title: { [key: string]: string }; // e.g., { en: "Title", ja: "タイトル" }
  description: { [key: string]: string }; // e.g., { en: "Desc", ja: "説明" }
}

export const presentationsManifest: PresentationManifestItem[] = [
  {
    slug: "introduction",
    thumbnail: "introduction.png", // Assume introduction.png exists or will be added
    published: true,
    title: {
      en: "Introduction to the Value Emergence System",
      ja: "価値創発システム入門",
    },
    description: {
      en: "A brief overview of the core ideas.",
      ja: "中心となる考え方の概要です。",
    },
  },
  // Add the new test-slide entry
  {
    slug: "test-slide",
    thumbnail: "test-slide.png",
    published: true,
    title: {
      en: "Test Slide",
      ja: "テストスライド",
    },
    description: {
      en: "This is a test presentation.",
      ja: "これはテスト用のプレゼンテーションです。",
    },
  },
  // Add more presentations here as they are created
];
