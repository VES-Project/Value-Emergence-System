"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react'
import React, { useCallback, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

interface Work {
  slug: string
  title: string
  date?: string
  excerpt?: string
  authors?: string[]
}

export function WorkCarousel({
  works,
  viewAllText,
  lang,
  readMoreText,
  authorsText,
}: {
  works: Work[]
  viewAllText: string
  lang: string
  readMoreText: string
  authorsText: string
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', slidesToScroll: 1 })
  const [selectedIndex, setSelectedIndex] = useState(0);
  const emblaNodeRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const wheelThrottleDelay = 100;

  const { ref: sectionRef, isVisible: isSectionVisible } = useAnimateOnScroll();

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) {
      onSelect(emblaApi);
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
    }
    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
      }
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !emblaNodeRef.current) return;

    const emblaNode = emblaNodeRef.current;

    const handleWheel = (event: WheelEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastWheelTimeRef.current < wheelThrottleDelay) {
        event.preventDefault();
        return;
      }

      lastWheelTimeRef.current = currentTime;
      event.preventDefault();

      const wheelRotation = Math.sign(event.deltaY);
      if (wheelRotation < 0) {
        emblaApi.scrollPrev();
      } else if (wheelRotation > 0) {
        emblaApi.scrollNext();
      }
    };

    emblaNode.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener('wheel', handleWheel);
      }
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !emblaNodeRef.current) return;

    const emblaNode = emblaNodeRef.current;

    const handleClick = (event: MouseEvent) => {
      if (!emblaApi || !emblaNode) return;

      const targetElement = event.target as HTMLElement;
      if (targetElement.closest('.embla__slide a, .embla__slide button')) {
         return;
      }

      const nodeRect = emblaNode.getBoundingClientRect();
      const clickX = event.clientX - nodeRect.left;
      const nodeWidth = nodeRect.width;

      if (clickX < nodeWidth / 2) {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    };

    emblaNode.addEventListener('click', handleClick);

    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener('click', handleClick);
      }
    };
  }, [emblaApi]);

  if (!works || works.length === 0) {
    return (
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/10">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Latest Works</h2>
          <p>No works available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="latest-works"
      ref={sectionRef}
      className={cn(
        "py-12 overflow-hidden transition-all duration-700 ease-out",
        isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto">
        <div className="text-center mb-8"> 
          <h2 className="text-3xl font-bold">Latest Works</h2>
        </div>

        <div className="embla relative" ref={emblaNodeRef}>
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container flex" style={{ perspective: '1000px' }}>
              {works.map((work, index) => (
                <div key={work.slug} className="embla__slide flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 pl-4 relative">
                  <Card
                    className="flex flex-col h-full transition-transform duration-500 ease-out"
                    style={{
                      transformOrigin: 'center bottom',
                      transform: `
                        perspective(1000px)
                        rotateY(${(index - selectedIndex) * -35}deg)
                        translateZ(${Math.abs(index - selectedIndex) * -80}px)
                        translateX(${(index - selectedIndex) * 25}%)
                        scale(${1 - Math.abs(index - selectedIndex) * 0.15})
                      `,
                      opacity: Math.abs(index - selectedIndex) < 2 ? 1 : 0.3,
                      zIndex: works.length - Math.abs(index - selectedIndex),
                    }}
                  >
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/${lang}/works/${work.slug}`} className="block"> 
                          <h3 className="text-lg font-semibold mb-1 group-hover:underline">
                            {work.title}
                          </h3>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {work.date && (
                        <p className="text-sm text-gray-500 mb-2">{work.date}</p>
                      )}
                      {work.authors && work.authors.length > 0 ? (
                        <p className="text-sm text-gray-500 mb-2">{authorsText}: {
                          work.authors.map((author, i) => (
                             <span key={i}>
                              {author}
                              {work.authors && i < work.authors.length - 1 ? ", " : ""}
                            </span>
                          ))
                        }</p>
                      ) : null}
                      {work.excerpt && (
                        <p className="text-gray-600 mb-3">{work.excerpt}</p>
                      )}
                      <Link href={`/${lang}/works/${work.slug}`} className="text-sm hover:underline mt-2 inline-block">
                        {readMoreText}
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href={`/${lang}/works`} className="hover:underline">{viewAllText}</Link>
        </div>
      </div>
    </section>
  )
}
