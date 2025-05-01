export interface PresentationManifestItem {
  slug: string;
  thumbnail?: string; // Optional thumbnail image filename (e.g., 'intro.png')
  published: boolean;
}

export const presentationsManifest: PresentationManifestItem[] = [
  {
    slug: "introduction",
    thumbnail: "introduction.png", // Assume introduction.png exists or will be added
    published: true,
  },
  // Add more presentations here as they are created
];
