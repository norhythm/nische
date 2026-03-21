"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AnalyticsPageviewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    window.gtag("event", "page_view", {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsPageview() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageviewInner />
    </Suspense>
  );
}
