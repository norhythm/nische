"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type StyleType = "layer" | "button";

export default function BackComponent({
  className = "",
  style = "layer",
}: {
  className?: string;
  style?: StyleType;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isFromSiteNavigation, setIsFromSiteNavigation] = useState(false);

  useEffect(() => {
    // ページ読み込み時にブラウザ履歴があるかチェック
    setCanGoBack(window.history.length > 1);

    // サイト内ナビゲーションからの遷移かどうかをチェック
    const checkNavigation = () => {
      // referrerが同じオリジンかチェック
      const currentOrigin = window.location.origin;
      const referrer = document.referrer;
      const isFromSameOrigin = referrer.startsWith(currentOrigin);

      // sessionStorageでサイト内遷移を追跡
      const wasInternalNavigation =
        sessionStorage.getItem("isInternalNavigation") === "true";

      setIsFromSiteNavigation(isFromSameOrigin || wasInternalNavigation);

      // 現在のページロード後、フラグをリセット
      sessionStorage.removeItem("isInternalNavigation");
    };

    checkNavigation();
  }, []);

  const handleBack = () => {
    const fromTag = searchParams.get("fromTag");

    // sessionStorageから保存されたタグを取得
    const savedTag =
      typeof window !== "undefined"
        ? sessionStorage.getItem("selectedTag")
        : null;

    const isOnWorkDetailPage = window.location.pathname.startsWith("/works/");
    const hasTagToPreserve = fromTag || savedTag;

    console.log(isOnWorkDetailPage, hasTagToPreserve, fromTag, savedTag);

    if (isOnWorkDetailPage && canGoBack && isFromSiteNavigation) {
      // fromTagがある場合は、prev/nextで詳細ページ間遷移後なので、タグ付きトップページに遷移
      if (fromTag && hasTagToPreserve) {
        router.push(`/?tag=${hasTagToPreserve}`);
        return;
      }

      // fromTagがない場合は、トップページからの直接遷移なのでhistory.back()
      if (!fromTag) {
        window.history.back();
        return;
      }
    }

    // 3. 外部サイトからのアクセスやブラウザ履歴なし、または同じオリジンでない遷移 -> トップページに遷移
    if (!canGoBack || !isFromSiteNavigation) {
      router.push("/");
      return;
    }

    // デフォルト: 通常のブラウザ戻る
    window.history.back();
  };

  return (
    <>
      {style == "layer" && (
        <div
          onClick={handleBack}
          className={`fixed top-0 left-0 z-20 w-full h-full cursor-close`}
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
    </>
  );
}
