"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ConceptSlide } from '@/lib/mdx';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { useMDXComponents } from '@/mdx-components'; // mdx-components.tsx をインポート

interface ConceptSliderProps {
  slides: ConceptSlide[];
}

interface SerializedSlide extends Omit<ConceptSlide, 'content'> {
  mdxSource: MDXRemoteSerializeResult;
}

export function ConceptSlider({ slides }: ConceptSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [serializedSlides, setSerializedSlides] = useState<SerializedSlide[]>([]);
  const components = useMDXComponents({}); // MDXコンポーネントを取得
  const [isFullscreen, setIsFullscreen] = useState(false); // 全画面状態
  const sliderRef = useRef<HTMLDivElement>(null); // スライダーコンテナへの参照

  useEffect(() => {
    // クライアントサイドでMDXをシリアライズ
    const serializeContent = async () => {
      const serialized = await Promise.all(
        slides.map(async (slide) => {
          const mdxSource = await serialize(slide.content, {
             mdxOptions: {
               // remarkPlugins や rehypePlugins を設定する場合
             },
             parseFrontmatter: false // フロントマターは既にパース済み
           });
          return { ...slide, mdxSource };
        })
      );
      setSerializedSlides(serialized);
    };
    serializeContent();
  }, [slides]);

  // 全画面切り替え関数
  const toggleFullscreen = () => {
    if (!sliderRef.current) return;

    if (!document.fullscreenElement) {
      sliderRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 全画面状態の変更を監視
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // iOS Safari 用のプレフィックス付きイベントも考慮
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const totalSlides = serializedSlides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // スライド切り替え方向を保持するためのstate（アニメーション用）
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  if (totalSlides === 0) {
    return <div>Loading slides or no slides available...</div>; // ローディング表示
  }

  const activeSlide = serializedSlides[currentSlide];

  return (
    <div ref={sliderRef} className="relative w-full max-w-3xl mx-auto overflow-hidden border rounded-lg shadow-lg bg-background aspect-video">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 p-6 flex flex-col justify-center prose prose-xs dark:prose-invert max-w-none"
        >
          <h2 className="text-2xl font-bold mb-4">{activeSlide.title}</h2>
          <MDXRemote {...activeSlide.mdxSource} components={components} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-gray-800 text-white opacity-75 hover:opacity-100 disabled:opacity-30 z-10 mx-2"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-gray-800 text-white opacity-75 hover:opacity-100 disabled:opacity-30 z-10 mx-2"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicator and Fullscreen Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <span className="text-sm text-gray-500">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={toggleFullscreen}
          className="p-1 rounded-full bg-gray-800 text-white opacity-75 hover:opacity-100"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
} 