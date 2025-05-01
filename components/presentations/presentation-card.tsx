"use client"; // Mark as Client Component

import Image from 'next/image';
import Link from 'next/link';
import type { PresentationMeta } from '@/lib/mdx'; // Assuming PresentationMeta is exported from lib/mdx

interface PresentationCardProps {
  lang: string;
  presentation: PresentationMeta;
  title: string;
  description: string;
}

export function PresentationCard({
  lang,
  presentation,
  title,
  description,
}: PresentationCardProps) {
  const fallbackThumbnail = '/images/thumbnails/placeholder.png';
  const thumbnailUrl = presentation.thumbnail
    ? `/images/thumbnails/${presentation.thumbnail}`
    : fallbackThumbnail; // Use fallback directly if no thumbnail

  return (
    // Key moved to the parent map in ConceptsPage
    <Link href={`/${lang}/presentations/${presentation.slug}/`} legacyBehavior>
      <a className="block group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-video bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title} // Use the passed title for alt text
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            // onError can be used here in the Client Component
            onError={(e) => {
              // Prevent infinite loop if fallback also fails
              if (e.currentTarget.src !== fallbackThumbnail) {
                e.currentTarget.src = fallbackThumbnail;
              }
             }}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </a>
    </Link>
  );
}
