"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll"
import { icons } from 'lucide-react';
import Link from "next/link";

interface IconProps {
  name: string;
  color?: string;
  size?: number;
}

const Icon = ({ name, color, size }: IconProps) => {
  // @ts-expect-error - Dynamic icon name lookup
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};

// 各カードをラップするアニメーションコンポーネント
function AnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
  const { ref, isVisible } = useAnimateOnScroll()
  const delay = index * 100 // 要素ごとに表示遅延を設定 (ミリ秒)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }} // Tailwindでは直接指定できないためstyle属性を使用
    >
      {children}
    </div>
  )
}

export interface ConceptItem {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

export function ConceptSection({ concepts, lang, viewDetailsText }: { concepts: ConceptItem[], lang: string, viewDetailsText: string }) {
  const { ref: sectionRef, isVisible: isSectionVisible } = useAnimateOnScroll()

  return (
    <section
      id="concepts"
      ref={sectionRef} // セクション全体にrefを設定
      className={`scroll-mt-20 py-12 transition-all duration-700 ease-out ${ // scroll-mt-20 とアニメーションクラスを追加
        isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Hardcode the title or use a default */}
      <h2 className="text-3xl font-bold text-center mb-12">Concepts</h2>

      <div className="grid grid-cols-1 gap-8">
        {concepts.map((concept, index) => (
          <AnimatedCard key={index} index={index}>
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {/* Render the dynamic icon component */}
                  <Icon name={concept.icon} size={24} />
                </div>
                <CardTitle>{concept.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{concept.description}</CardDescription>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href={`/${lang}/concepts`} className="hover:underline">
          {viewDetailsText}
        </Link>
      </div>
    </section>
  )
}
