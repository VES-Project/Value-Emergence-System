export interface WorkManifestItem {
  slug: string;
  published: boolean;
}

export const worksManifest: WorkManifestItem[] = [
  { slug: "hypothesis-and-method", published: true },
  { slug: "form-of-belief", published: true }, // 1.01
  { slug: "proof-of-value", published: true }, // 1.02
  // { slug: "dynamics-of-belief", published: true }, // 1.03
  // { slug: "universal-form-of-truth-goodness-and-beauty", published: true }, // 1.1
  // { slug: "generation-and-iteration-of-structure", published: true }, // 1.2
  // { slug: "pluralistic-harmony", published: true }, // 1.3
]; 