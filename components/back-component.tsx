"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSelectedTagContext } from "@/lib/selected-tag-context";
import MobileTouchCursor from "./mobile-touch-cursor";

type StyleType = "layer" | "button" | "mobile-cursor";

const NAV_HISTORY_KEY = "navHistory";

function getNavHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(NAV_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
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
    const navHistory = getNavHistory();
    const hasPreviousPage = navHistory.length > 1;

    const path = "";

    if (hasPreviousPage) {
      // サイト内ナビゲーション履歴がある場合はhistory.back()
      window.history.back();
    } else {
      // 外部からの直接アクセスまたは履歴がない場合はトップページへ
      if (selectedTag) {
        router.push(`${path}/?tag=${selectedTag}`);
      } else {
        router.push(`${path}/`);
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
