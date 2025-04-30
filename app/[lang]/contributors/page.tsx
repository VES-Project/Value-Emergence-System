import React from 'react';
import { getDictionary } from '@/lib/dictionaries';

export default async function ContributorsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contributors</h1>
      <p className="mb-8">{dictionary.contributorsPage.description}</p>
      {/* 今後、コントリビューター情報を表示するロジックを追加します */}
      {/* 例: <ContributorsList lang={lang} /> */}
    </div>
  );
} 