"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSelectedTagContext } from "@/lib/selected-tag-context";
import MobileTouchCursor from "./mobile-touch-cursor";

type StyleType = "layer" | "button" | "mobile-cursor";

export default function BackComponent({
  className = "",
  style = "layer",
}: {
  className?: string;
  style?: StyleType;
}) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isFromSiteNavigation, setIsFromSiteNavigation] = useState(false);
  const { selectedTag } = useSelectedTagContext();

  useEffect(() => {
    // ページ読み込み時にブラウザ履歴があるかチェック
    setCanGoBack(window.history.length > 1);

    // サイト内ナビゲーションからの遷移かどうかをチェック
    const checkNavigation = () => {
      // referrerが同じオリジンかチェック
      const currentOrigin = window.location.origin;
      const referrer = document.referrer;
      const isFromSameOrigin = referrer.startsWith(currentOrigin);

      setIsFromSiteNavigation(isFromSameOrigin);
    };

    checkNavigation();
  }, []);

  const handleBack = () => {
    const isOnWorkDetailPage = window.location.pathname.startsWith("/works/");

    if (isOnWorkDetailPage && canGoBack && isFromSiteNavigation) {
      // 通常の詳細ページ遷移（トップページから）の場合はhistory.back()
      window.history.back();
      return;
    }

    // 外部サイトからのアクセスやブラウザ履歴なし、または同じオリジンでない遷移 -> トップページに遷移
    if (!canGoBack || !isFromSiteNavigation) {
      if (selectedTag) {
        router.push(`/?tag=${selectedTag}`);
      } else {
        router.push("/");
      }
      return;
    }

    // デフォルト: 通常のブラウザ戻る
    window.history.back();
  };

  return (
    <>
      <Suspense>
        {style == "layer" && (
          <div
            onClick={handleBack}
            className={`hidden md:block fixed top-0 left-0 z-20 w-full h-full cursor-close select-none`}
          ></div>
        )}
        {style == "button" && (
          <button
            onClick={handleBack}
            className={`flex items-center text-sm md:text-base hover:opacity-80 transition-colors ${className}`}
          >
            <span className="hidden">Back</span>
            <span className="icon-cross"></span>
          </button>
        )}
        {style == "mobile-cursor" && (
          <div
            id="touch-layer"
            className={`block md:hidden fixed top-0 left-0 z-20 w-full h-full select-none`}
          >
            <MobileTouchCursor onTap={handleBack} className={className} />
          </div>
        )}
      </Suspense>
    </>
  );
}
