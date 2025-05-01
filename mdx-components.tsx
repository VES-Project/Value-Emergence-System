import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import { Alert } from '@/components/mdx/mdx-alert'
import React from 'react'

// MDX内で使用するカスタムコンポーネントやHTMLタグのスタイルを定義
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 標準のimgタグをNext.jsのImageコンポーネントに置き換える（オプション）
    img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const defaultAlt = ''
      return (
        <span style={{ display: 'block', position: 'relative', width: '100%', paddingBottom: '50%' }}> {/* アスペクト比調整例 */}
          <Image
            alt={alt || defaultAlt}
            layout="fill"
            objectFit="contain"
            {...(props as Omit<ImageProps, 'alt'>)}
          />
        </span>
      )
    },
    // カスタムコンポーネントを登録
    Alert: Alert,
    Image: Image, // next/image の Image コンポーネントを提供
    // 他のHTMLタグのスタイルをカスタマイズすることも可能
    // h1: ({ children }) => <h1 style={{ color: 'tomato' }}>{children}</h1>,
    ...components, // 既存のコンポーネント設定をマージ
  }
} 