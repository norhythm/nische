"use client";

import { useRouter } from "next/navigation";

export default function BackLayer() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div
      onClick={handleBack}
      className="fixed top-0 left-0 z-20 w-full h-full cursor-close"
    ></div>
  );
}
