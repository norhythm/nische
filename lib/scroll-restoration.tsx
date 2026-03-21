"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SCROLL_POSITIONS_KEY = "scrollPositions";
const PREV_PATH_KEY = "prevPath";

interface ScrollPositions {
  [key: string]: number;
}

function getScrollPositions(): ScrollPositions {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveScrollPosition(path: string, position: number) {
  if (typeof window === "undefined") return;
  try {
    const positions = getScrollPositions();
    positions[path] = position;
    sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
  } catch {}
}

export default function ScrollRestoration() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // Save scroll position on scroll (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveScrollPosition(pathname, window.scrollY);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Track previous path for back navigation
  useEffect(() => {
    console.log("[ScrollRestoration] pathname changed:", pathname, "prev:", prevPathname.current);
    if (prevPathname.current !== null) {
      sessionStorage.setItem(PREV_PATH_KEY, prevPathname.current);
      console.log("[ScrollRestoration] saved prevPath:", prevPathname.current);
    }
    prevPathname.current = pathname;
  }, [pathname]);

  // Restore scroll position when navigating back to top page
  useEffect(() => {
    const handlePopState = () => {
      const pos = getScrollPositions()[window.location.pathname];
      if (pos != null) {
        const restore = () => window.scrollTo(0, pos);
        restore();
        [50, 100, 200, 500].forEach((delay) => {
          setTimeout(() => {
            if (Math.abs(window.scrollY - pos) > 10) {
              restore();
            }
          }, delay);
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return null;
}
