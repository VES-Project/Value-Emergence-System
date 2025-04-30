"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import MarkdownIt from "markdown-it"
import katex from "katex"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"
import { DynamicSvgLoader } from './dynamic-svg-loader'
import markdownItHighlightJs from "markdown-it-highlightjs"
import type { HLJSApi } from 'highlight.js'

// Add module declaration for markdown-it-katex
declare module "markdown-it-katex"

function pascalToTitleCase(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\\d])([A-Z])/g, '$1 $2')
    .trim()
}

interface ContentSegment {
  type: 'html' | 'svg';
  value: string;
}

export function MarkdownContent({ content }: { content: string }) {
  const [segments, setSegments] = useState<ContentSegment[]>([]);
  const params = useParams();
  const localeParam = params?.lang;
  const currentLocale = typeof localeParam === 'string' ? localeParam : 'en';

  useEffect(() => {
    // {{keyword}} を Scrapbox リンク (Markdown 形式) に変換する
    let processedContent = content.replace(
      /\{\{([^}]+?)\}\}/g,
      (match, keyword) => {
        const trimmedKeyword = keyword.trim();
        const encodedKeyword = encodeURIComponent(trimmedKeyword);
        const url = `https://scrapbox.io/ves-project/${encodedKeyword}`;
        return `[${trimmedKeyword}](${url} "Scrapbox: ${trimmedKeyword}")`;
      }
    );

    // KaTeX の処理（変更なし）
    processedContent = processedContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `<div class="math-block">${rendered}</div>`;
      } catch (e) {
        console.error("KaTeX block error:", e);
        return `<div class="math-error">[Block Error]</div>`;
      }
    });
    processedContent = processedContent.replace(/(?<!\$)\$([^$]+?)\$(?!\$)/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false,
        });
        return `<span class="math-inline">${rendered}</span>`;
      } catch (e) {
        console.error("KaTeX inline error:", e);
        return `<span class="math-error">[Inline Error]</span>`;
      }
    });

    // MarkdownIt の初期化と設定（変更なし）
    const md = new MarkdownIt({
      html: true, // HTML タグを許可
      linkify: true,
      typographer: true,
    })
      .use(markdownItHighlightJs, {
        inline: true,
        register: {
          latex: (hljs: HLJSApi) => hljs.getLanguage("latex"),
        },
       });

    // MarkdownIt の link_open ルールをオーバーライドして、Scrapbox リンクにクラスと target を追加
    const defaultLinkOpenRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const hrefIndex = token.attrs ? token.attrIndex('href') : -1;
      if (hrefIndex !== -1 && token.attrs) {
        const href = token.attrs[hrefIndex][1];
        if (href.startsWith('https://scrapbox.io/ves-project/')) {
          token.attrPush(['target', '_blank']);
          token.attrPush(['rel', 'noopener noreferrer']);
          token.attrPush(['class', 'scrapbox-link']);
        }
      }
      return defaultLinkOpenRender(tokens, idx, options, env, self);
    };

    // 画像レンダラーのカスタマイズ（変更なし）
    const defaultImageRenderer = md.renderer.rules.image
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const srcIndex = token.attrIndex("src")
      const src = (token.attrs && srcIndex >= 0) ? token.attrs[srcIndex][1] : ""
      const alt = token.content || ""
      if (src.startsWith("/")) {
         return `<div class="relative w-full h-64 md:h-96 my-8">
                  <img src="${src}" alt="${alt}" class="object-contain" style="position: absolute; height: 100%; width: 100%; inset: 0; color: transparent;" />
                </div>`
      }
      if (defaultImageRenderer) {
        return defaultImageRenderer(tokens, idx, options, env, self)
      }
      return self.renderToken(tokens, idx, options)
    }

    // セグメント分割処理 (SVG プレースホルダー用)
    const newSegments: ContentSegment[] = [];
    const placeholderRegex = /<(\w+)\s*\/>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = placeholderRegex.exec(processedContent)) !== null) {
      if (match.index > lastIndex) {
        const htmlPart = processedContent.substring(lastIndex, match.index);
        newSegments.push({ type: 'html', value: md.render(htmlPart).trim() });
      }

      const componentName = match[1];
      const svgFileName = pascalToTitleCase(componentName);
      newSegments.push({ type: 'svg', value: svgFileName });

      lastIndex = placeholderRegex.lastIndex;
    }

    if (lastIndex < processedContent.length) {
      const htmlPart = processedContent.substring(lastIndex);
      newSegments.push({ type: 'html', value: md.render(htmlPart).trim() });
    }

    setSegments(newSegments.filter(segment => segment.type !== 'html' || segment.value !== ''));

  }, [content]);

  // レンダリング部分（変更なし）
  return (
    <div className="prose md:prose-lg max-w-none break-words">
      {segments.map((segment, index) => {
        if (segment.type === 'html') {
          return <div key={index} dangerouslySetInnerHTML={{ __html: segment.value }} />;
        } else if (segment.type === 'svg') {
          return (
            <div key={index} className="my-8 border rounded-lg p-4 bg-white shadow-sm">
              <DynamicSvgLoader svgFileName={segment.value} forceLang={currentLocale} className="" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}