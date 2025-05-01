"use client";

import Link from "next/link";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { PresentationManifestItem } from "@/content/presentations/manifest"; // Import the presentation type
import { PresentationCard } from "./presentation-card"; // Import PresentationCard

export function PresentationCarousel({
  presentations,
  lang,
}: {
  presentations: PresentationManifestItem[];
  lang: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
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
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
    }
    return () => {
      if (emblaApi) {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
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

    emblaNode.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener("wheel", handleWheel);
      }
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !emblaNodeRef.current) return;

    const emblaNode = emblaNodeRef.current;

    const handleClick = (event: MouseEvent) => {
      if (!emblaApi || !emblaNode) return;

      const targetElement = event.target as HTMLElement;
      // Allow clicks inside the PresentationCard (which includes the link)
      if (targetElement.closest(".presentation-card-link")) {
        return;
      }
      // Prevent carousel scroll if clicking specifically on the card content that isn't the link
      if (targetElement.closest(".embla__slide > div")) {
        // Check if the click is outside the main link area within the card
        const linkElement = emblaNode.querySelector(
          `[data-index="${selectedIndex}"] .presentation-card-link`
        );
        if (linkElement && !linkElement.contains(targetElement)) {
          // Optionally do nothing, or implement specific logic if needed
        } else if (!linkElement) {
          // Fallback if linkElement not found, scroll
          const nodeRect = emblaNode.getBoundingClientRect();
          const clickX = event.clientX - nodeRect.left;
          const nodeWidth = nodeRect.width;

          if (clickX < nodeWidth / 2) {
            emblaApi.scrollPrev();
          } else {
            emblaApi.scrollNext();
          }
        }
        return; // Prevent scrolling if click is within card bounds but not on the link
      }

      // Scroll if clicking outside the card area
      const nodeRect = emblaNode.getBoundingClientRect();
      const clickX = event.clientX - nodeRect.left;
      const nodeWidth = nodeRect.width;

      if (clickX < nodeWidth / 2) {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    };

    emblaNode.addEventListener("click", handleClick);

    return () => {
      if (emblaNode) {
        emblaNode.removeEventListener("click", handleClick);
      }
    };
  }, [emblaApi, selectedIndex]); // Add selectedIndex dependency

  return (
    <section
      id="presentations-carousel"
      ref={sectionRef}
      className={cn(
        "py-12 overflow-hidden transition-all duration-700 ease-out",
        isSectionVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto">
        <div className="embla relative" ref={emblaNodeRef}>
          <div className="embla__viewport" ref={emblaRef}>
            <div
              className="embla__container flex"
              style={{ perspective: "1000px" }}
            >
              {presentations.map((presentation, index) => (
                <div
                  key={presentation.slug}
                  className="embla__slide flex-[0_0_80%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0 pl-4 relative group"
                  data-index={index} // Add data-index for click handler
                >
                  <div // Add an inner div for styling and click handling scope
                    className="transition-transform duration-500 ease-out w-full h-full"
                    style={{
                      transformOrigin: "center bottom",
                      transform: `
                        perspective(1000px)
                        rotateY(${(index - selectedIndex) * -35}deg)
                        translateZ(${Math.abs(index - selectedIndex) * -80}px)
                        translateX(${(index - selectedIndex) * 25}%)
                        scale(${1 - Math.abs(index - selectedIndex) * 0.15})
                      `,
                      opacity: Math.abs(index - selectedIndex) < 2 ? 1 : 0.3,
                      zIndex:
                        presentations.length - Math.abs(index - selectedIndex),
                    }}
                  >
                    <PresentationCard
                      slug={presentation.slug}
                      thumbnail={presentation.thumbnail}
                      lang={lang}
                      title={presentation.title[lang] || presentation.title.en}
                      description={
                        presentation.description[lang] ||
                        presentation.description.en
                      }
                      className="h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
