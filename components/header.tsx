"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [textColor, setTextColor] = useState("text-black");

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;

      const headerRect = header.getBoundingClientRect();
      const centerY = headerRect.top + headerRect.height / 2;

      const elementBehind = document.elementFromPoint(
        window.innerWidth / 2,
        centerY + headerRect.height
      );

      if (elementBehind) {
        const computedStyle = window.getComputedStyle(elementBehind);
        const bgColor = computedStyle.backgroundColor;

        // console.log(computedStyle, bgColor);

        if (bgColor && bgColor !== "transparent") {
          const brightness = getBrightness(bgColor);
          setTextColor(brightness > 128 ? "text-black" : "text-white");
        } else {
          const parentBg = getParentBackgroundColor(elementBehind);
          if (parentBg) {
            const brightness = getBrightness(parentBg);
            setTextColor(brightness > 128 ? "text-black" : "text-white");
          }
        }
      }
    };

    const getBrightness = (color: string) => {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        return (r * 299 + g * 587 + b * 114) / 1000;
      }
      return 255;
    };

    const getParentBackgroundColor = (element: Element): string | null => {
      let parent = element.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const bgColor = style.backgroundColor;
        if (
          bgColor &&
          bgColor !== "rgba(0, 0, 0, 0)" &&
          bgColor !== "transparent"
        ) {
          return bgColor;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 py-8 md:py-[60px]">
        <div className="container md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <h1
            className={`md:text-xl font-medium text-base flex justify-content items-center tracking-wider`}
          >
            <Link
              href="/"
              className="hover:text-gray-500 cursor-pointer transition-colors uppercase"
            >
              <span
                className={`font-base ${textColor} transition-colors duration-1000`}
              >
                Tsukasa Kikuchi
              </span>
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-base tracking-wider">
              <li>
                <Link
                  href="/biography/"
                  className="hover:text-gray-500 transition-colors"
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className="hover:text-gray-500 transition-colors"
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
