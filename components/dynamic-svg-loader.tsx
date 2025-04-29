"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DynamicSvgLoaderProps {
  svgFileName: string
  className?: string
  forceLang?: string
}

const DynamicSvgLoaderInternal: React.FC<DynamicSvgLoaderProps> = ({ svgFileName, className, forceLang }) => {
  const [error, setError] = useState(false);
  const currentLocale = forceLang || 'en'

  const encodedFileName = encodeURIComponent(svgFileName)

  const svgUrl = `/svg/${currentLocale}/${encodedFileName}.svg`

  const handleError = () => {
    console.error(`Failed to load image: ${svgUrl}`);
    setError(true);
  };

  if (error) {
    return (
      <div className={cn("w-full p-4 border border-dashed border-red-500 bg-red-50 text-red-700 text-center rounded-md", className)}>
        SVG not found: <br />
        <code>{`${currentLocale}/${svgFileName}.svg`}</code>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={svgUrl} 
      alt={svgFileName}
      className={cn("w-full h-auto", className)}
      onError={handleError}
    />
  )
}

export { DynamicSvgLoaderInternal as DynamicSvgLoader }