"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [textColor, setTextColor] = useState("text-black");
  const pathname = usePathname();

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const h1Element = document.querySelector("h1");
  //     const headerElement = document.querySelector("header");
  //     if (!h1Element || !headerElement) return;

  //     const h1Rect = h1Element.getBoundingClientRect();
  //     const headerRect = headerElement.getBoundingClientRect();
  //     const scrollY = window.scrollY;

  //     // h1要素の中心位置（現在の表示位置）
  //     const centerX = h1Rect.left + h1Rect.width / 2;
  //     const currentCenterY = h1Rect.top + h1Rect.height / 2;

  //     // sticky headerの場合、スクロール分を加算して実際の背景位置を計算
  //     const adjustedCenterY = currentCenterY + scrollY;

  //     // headerが固定されている場合、その分を考慮
  //     const headerHeight = headerRect.height;
  //     const absoluteCheckY =
  //       headerRect.top <= 0 ? adjustedCenterY : currentCenterY;

  //     console.log("📍 Position calculation:", {
  //       scrollY,
  //       headerTop: headerRect.top,
  //       headerHeight,
  //       currentCenterY,
  //       adjustedCenterY,
  //       absoluteCheckY,
  //     });

  //     // 実際の背景色を取得するための座標で要素を検出
  //     const elementBehind = document.elementFromPoint(centerX, absoluteCheckY);

  //     if (elementBehind) {
  //       const finalBgColor = getEffectiveBackgroundColor(elementBehind);

  //       console.log("🔍 iOS-style Debug Info:", {
  //         checkPosition: { x: centerX, y: absoluteCheckY },
  //         elementBehind: elementBehind.tagName,
  //         className: elementBehind.className,
  //         finalBgColor,
  //         scrollY,
  //         isSticky: headerRect.top <= 0,
  //       });

  //       if (finalBgColor) {
  //         const brightness = getBrightness(finalBgColor);
  //         const newTextColor = brightness > 128 ? "text-black" : "text-white";
  //         console.log(
  //           `🎨 Color decision - brightness: ${brightness}, textColor: ${newTextColor}`
  //         );
  //         setTextColor(newTextColor);
  //       } else {
  //         console.log("⚠️ No background detected, using white text");
  //         setTextColor("text-white");
  //       }
  //     }
  //   };

  //   const getBrightness = (color: string) => {
  //     const rgb = color.match(/\d+/g);
  //     if (rgb && rgb.length >= 3) {
  //       const r = parseInt(rgb[0]);
  //       const g = parseInt(rgb[1]);
  //       const b = parseInt(rgb[2]);
  //       return (r * 299 + g * 587 + b * 114) / 1000;
  //     }
  //     return 255;
  //   };

  //   const getEffectiveBackgroundColor = (element: Element): string | null => {
  //     let current = element;
  //     const maxDepth = 10; // 無限ループ防止
  //     let depth = 0;

  //     while (current && depth < maxDepth) {
  //       const style = window.getComputedStyle(current);
  //       const bgColor = style.backgroundColor;
  //       const bgImage = style.backgroundImage;

  //       // 背景画像がある場合は暗めに仮定
  //       if (bgImage && bgImage !== "none") {
  //         console.log(`🖼️ Background image detected on ${current.tagName}`);
  //         return "rgb(80, 80, 80)"; // 暗めの色を仮定
  //       }

  //       // 有効な背景色がある場合
  //       if (
  //         bgColor &&
  //         bgColor !== "rgba(0, 0, 0, 0)" &&
  //         bgColor !== "transparent" &&
  //         bgColor !== "initial" &&
  //         bgColor !== "inherit"
  //       ) {
  //         console.log(`🎯 Found bg color: ${bgColor} on ${current.tagName}`);
  //         return bgColor;
  //       }

  //       current = current.parentElement;
  //       depth++;
  //     }

  //     // 最終的にbody要素の背景色を確認
  //     const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  //     if (bodyBg && bodyBg !== "rgba(0, 0, 0, 0)" && bodyBg !== "transparent") {
  //       console.log(`📄 Using body background: ${bodyBg}`);
  //       return bodyBg;
  //     }

  //     // デフォルトは白
  //     console.log("🔄 Using default white background");
  //     return "rgb(255, 255, 255)";
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   handleScroll();

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 py-6 md:py-[60px] pointer-events-none">
        <div className="container md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <h1
            className={`md:text-xl font-medium text-base flex justify-content items-center tracking-wider`}
          >
            <Link
              href="/"
              className={`font-base hover:text-gray-500 cursor-pointer transition-colors uppercase pointer-events-auto`}
            >
              Tsukasa Kikuchi
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-base tracking-wider">
              <li>
                <Link
                  href="/biography/"
                  className={`hover:text-gray-500 transition-colors duration-300 ease-in-out ${textColor} pointer-events-auto ${
                    pathname === "/biography" ? "" : ""
                  }`}
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className={`hover:text-gray-500 transition-colors duration-300 ease-in-out ${textColor} pointer-events-auto ${
                    pathname === "/contact" ? "" : ""
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
