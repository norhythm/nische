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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevUrl) {
        router.push(prevUrl);
      } else if (e.key === "ArrowRight" && nextUrl) {
        router.push(nextUrl);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && nextUrl) {
          // Swiped left -> next
          router.push(nextUrl);
        } else if (diff < 0 && prevUrl) {
          // Swiped right -> prev
          router.push(prevUrl);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
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
