export interface PresentationManifestItem {
  slug: string;
  thumbnail?: string; // Optional thumbnail image filename (e.g., 'intro.png')
  published: boolean;
  // Add multilingual metadata
  title: { [key: string]: string }; // e.g., { en: "Title", ja: "タイトル" }
  description: { [key: string]: string }; // e.g., { en: "Desc", ja: "説明" }
}

export const presentationsManifest: PresentationManifestItem[] = [
  // Add the new value-universality slide entry
  {
    slug: "value-universality",
    thumbnail: "value-universality.png", // Assume thumbnail will be generated
    published: true,
    title: {
      en: "Exploring Value Universality and Pluralism",
      ja: "価値の普遍性と多元性の探求",
    },
    description: {
      en: "Understanding Values through the Free Energy Principle.",
      ja: "自由エネルギー原理を手がかりに、価値の本質を探ります。",
    },
  },
  // Add the new social-structure slide entry
  {
    slug: "social-structure",
    thumbnail: "social-structure.png", // Assume thumbnail will be generated
    published: true,
    title: {
      en: "Understanding Historical Social Structures",
      ja: "情報論的・熱力学的な歴史的社会構造の解明",
    },
    description: {
      en: "Reinterpreting Kojin Karatani's work through Information Theory and Thermodynamics.",
      ja: "柄谷行人の『世界史の構造』を情報理論と熱力学で捉え直します。",
    },
  },
  // Add the new pragmatism slide entry
  {
    slug: "pragmatism",
    thumbnail: "pragmatism.png", // Assume thumbnail will be generated
    published: true,
    title: {
      en: "The Law of Least Cost Towards Fated Harmony",
      ja: "運命的調和への最小費用の法則",
    },
    description: {
      en: "Birth is natural, harmony is fated, and suffering is destined. Therefore, pragmatism as the 'Law of Least Cost Towards Fated Harmony' is the essence of the Value Emergence System.",
      ja: "価値創発システムの本質としてのプラグマティズム。",
    },
  },
  // Add more presentations here as they are created
];
