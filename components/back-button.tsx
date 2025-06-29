"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page if no history
      router.push("/");
    }
  };

  // const router = useRouter();

  // console.log(window.history);

  // const handleBack = () => {
  //   // ブラウザ履歴がない場合はホームページに遷移
  //   if (window.history.length <= 1) {
  //     router.push("/");
  //     return;
  //   }

  //   const referrer = document.referrer;

  //   if (referrer) {
  //     try {
  //       const referrerUrl = new URL(referrer);
  //       const currentUrl = new URL(window.location.href);

  //       // 同じオリジン（サイト内）からの遷移かチェック
  //       if (referrerUrl.origin === currentUrl.origin) {
  //         // 前のページにパラメータがある場合は履歴で戻る
  //         if (referrerUrl.search) {
  //           window.history.back();
  //           return;
  //         }
  //       }
  //     } catch (error) {
  //       console.error("URL parsing error:", error);
  //     }
  //   }

  //   // 前のページにパラメータがない場合、または外部サイトからの場合はホームページに遷移
  //   router.push("/");
  // };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center text-sm md:text-base hover:text-gray-500 transition-colors ${className}`}
    >
      <span className="hidden">Back</span>
      <span className="icon-cross"></span>
    </button>
  );
}
