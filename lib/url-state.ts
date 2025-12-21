import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSelectedTag() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTagState] = useState<string | null>(null);

  // Initialize from URL on mount
  useEffect(() => {
    const tagFromUrl = searchParams.get("tag");
    setSelectedTagState(tagFromUrl);
  }, [searchParams]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tagFromUrl = urlParams.get("tag");
      setSelectedTagState(tagFromUrl);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setSelectedTag = (tag: string | null) => {
    setSelectedTagState(tag);
    
    // Update URL
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set("tag", tag);
    } else {
      url.searchParams.delete("tag");
    }
    
    // Use pushState to add to history
    window.history.pushState(null, "", url.toString());
  };

  return [selectedTag, setSelectedTag] as const;
}