"use client";

import { useEffect, useRef, useState } from "react";

// 各要素のアニメーションを管理するカスタムフック
export function useAnimateOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
         observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
} 