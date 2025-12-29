"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevUrl) {
        router.push(prevUrl);
      } else if (e.key === "ArrowRight" && nextUrl) {
        router.push(nextUrl);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [prevUrl, nextUrl, router]);

  return null;
}
