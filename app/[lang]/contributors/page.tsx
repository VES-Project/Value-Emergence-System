import React from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { getAllContributors, ContributorMeta } from '@/lib/mdx'; // Import necessary functions and types
import Link from 'next/link'; // Import Link for potential future use
import Image from 'next/image'; // Import Image for potential future use

export default async function ContributorsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const contributors = await getAllContributors(lang); // Fetch contributors

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contributors</h1>
      <p className="mb-8">{dictionary.contributorsPage.description}</p>

      {contributors.length === 0 ? (
        <p>No contributors found for this language yet.</p> // Message if no contributors
      ) : (
        <div className="space-y-8 max-w-2xl mx-auto">
          {contributors.map((contributor) => (
            <div key={contributor.slug} className="border p-4 rounded-lg shadow flex flex-col">
              {contributor.image && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={contributor.image}
                    alt={contributor.title}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1 text-left">{contributor.title}</h2>
              {contributor.role && <p className="text-sm text-gray-600 mb-2 text-left">{contributor.role}</p>}
              {contributor.description && (
                <p className="text-sm text-gray-700 mb-4 mt-2 text-left">{contributor.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 