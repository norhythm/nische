"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSelectedTagContext } from "@/lib/selected-tag-context";
import MobileTouchCursor from "./mobile-touch-cursor";

type StyleType = "layer" | "button" | "mobile-cursor";

const PREV_PATH_KEY = "prevPath";

function getPrevPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(PREV_PATH_KEY);
  } catch {
    return null;
  }
}

export default function BackComponent({
  className = "",
  style = "layer",
}: {
  className?: string;
  style?: StyleType;
}) {
  const router = useRouter();
  const { selectedTag } = useSelectedTagContext();

  const handleBack = () => {
    const prevPath = getPrevPath();

    if (prevPath === "/") {
      window.history.back();
    } else {
      if (selectedTag) {
        router.push(`/?tag=${selectedTag}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <>
      <Suspense>
        {style == "layer" && (
          <div
            onClick={handleBack}
            className={`hidden md:block absolute top-0 left-1/2 -translate-x-1/2 z-20 w-screen h-full cursor-close select-none`}
          ></div>
        )}
        {style == "button" && (
          <button
            onClick={handleBack}
            className={`flex items-center p-2 text-sm md:text-base hover:opacity-80 transition-colors ${className}`}
          >
            <span className="hidden">Back</span>
            <span className="icon-cross"></span>
          </button>
        )}
        {style == "mobile-cursor" && (
          <div
            id="touch-layer"
            className={`block md:hidden absolute top-0 left-0 z-20 w-full h-full select-none`}
          >
            <MobileTouchCursor onTap={handleBack} className={className} />
          </div>
        )}
      </Suspense>
    </>
  );
}
