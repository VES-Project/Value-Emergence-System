"use client"; // Mark as Client Component

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PresentationCardProps {
  lang: string;
  slug: string;
  thumbnail?: string;
  title: string;
  description: string;
  className?: string;
}

export function PresentationCard({
  lang,
  slug,
  thumbnail,
  title,
  description,
  className,
}: PresentationCardProps) {
  const fallbackThumbnail = "/images/thumbnails/placeholder.png";
  const thumbnailUrl = thumbnail
    ? `/images/thumbnails/${thumbnail}`
    : fallbackThumbnail; // Use fallback directly if no thumbnail

  return (
    <Link href={`/${lang}/presentations/${slug}/`} legacyBehavior>
      <a
        className={cn(
          "presentation-card-link block group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground",
          className
        )}
      >
        <div className="relative aspect-video bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
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
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </a>
    </Link>
  );
}
