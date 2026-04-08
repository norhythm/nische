"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavigationProps {
  prevUrl?: string;
  nextUrl?: string;
}

export default function KeyboardNavigation({
  prevUrl,
  nextUrl,
}: KeyboardNavigationProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || target.isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft" && prevUrl) {
        router.push(prevUrl);
      } else if (e.key === "ArrowRight" && nextUrl) {
        router.push(nextUrl);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
      touchStartY.current = e.touches[0].clientY;
      touchEndY.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diffX = touchStartX.current - touchEndX.current;
      const diffY = touchStartY.current !== null && touchEndY.current !== null
        ? touchStartY.current - touchEndY.current
        : 0;
      const threshold = 100;

      if (Math.abs(diffX) > threshold && Math.abs(diffX) > 2 * Math.abs(diffY)) {
        if (diffX > 0 && nextUrl) {
          // Swiped left -> next
          router.push(nextUrl);
        } else if (diffX < 0 && prevUrl) {
          // Swiped right -> prev
          router.push(prevUrl);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
      touchStartY.current = null;
      touchEndY.current = null;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [prevUrl, nextUrl, router]);

  return null;
}
