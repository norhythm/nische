"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SCROLL_POSITIONS_KEY = "scrollPositions";
const NAV_HISTORY_KEY = "navHistory";

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

function getScrollPosition(path: string): number | null {
  const positions = getScrollPositions();
  return positions[path] ?? null;
}

function getNavHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(NAV_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function pushNavHistory(path: string) {
  if (typeof window === "undefined") return;
  try {
    const history = getNavHistory();
    if (history[history.length - 1] !== path) {
      history.push(path);
      if (history.length > 50) history.shift();
      sessionStorage.setItem(NAV_HISTORY_KEY, JSON.stringify(history));
    }
  } catch {}
}

function popNavHistory(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const history = getNavHistory();
    if (history.length > 0) {
      history.pop();
      sessionStorage.setItem(NAV_HISTORY_KEY, JSON.stringify(history));
      return history[history.length - 1] || null;
    }
    return null;
  } catch {
    return null;
  }
}

function peekNavHistory(): string | null {
  const history = getNavHistory();
  return history.length > 1 ? history[history.length - 2] : null;
}

export function useScrollRestoration() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  // Save scroll position on scroll events (debounced)
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

  // Handle pathname changes
  useEffect(() => {
    const savedPosition = getScrollPosition(pathname);
    const previousInHistory = peekNavHistory();
    const isBackNavigation = previousInHistory === pathname;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      pushNavHistory(pathname);
      prevPathname.current = pathname;
      return;
    }

    // Works pages always start at top
    const isWorksPage = pathname.startsWith("/works/");

    if (isBackNavigation && !isWorksPage) {
      popNavHistory();

      if (savedPosition !== null) {
        // Hide content during scroll restoration to prevent flicker
        document.documentElement.classList.add("scroll-restoring");

        const restore = () => window.scrollTo(0, savedPosition);

        restore();

        // Retry with increasing delays to handle async content loading
        [0, 50, 100, 200, 500].forEach((delay) => {
          setTimeout(() => {
            if (Math.abs(window.scrollY - savedPosition) > 10) {
              restore();
            }
          }, delay);
        });

        // Show content after restoration is complete
        setTimeout(() => {
          document.documentElement.classList.remove("scroll-restoring");
        }, 550);
      }
    } else {
      if (isBackNavigation) {
        popNavHistory();
      } else {
        pushNavHistory(pathname);
      }

      // Add page transition effect for forward navigation
      // document.documentElement.classList.add("page-transitioning");
      window.scrollTo(0, 0);

      // requestAnimationFrame(() => {
      //   document.documentElement.classList.remove("page-transitioning");
      // });
    }

    prevPathname.current = pathname;
  }, [pathname]);
}

export default function ScrollRestoration() {
  // useScrollRestoration();
  return null;
}
