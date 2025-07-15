"use client";

import { useEffect, useState, useRef } from "react";

interface MobileTouchCursorProps {
  onTap: () => void;
  className?: string;
}

export default function MobileTouchCursor({
  onTap,
  className = "",
}: MobileTouchCursorProps) {
  const [touchPosition, setTouchPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // モバイルデバイスかどうかを判定
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const layer = document.getElementById("touch-layer");
    if (!layer) return;

    let startPosition = { x: 0, y: 0 };
    let hasScrolled = false;
    let touchedInteractiveElement = false;

    const isInteractiveElement = (element: Element): boolean => {
      const interactiveSelectors = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "label",
        '[role="button"]',
        '[role="link"]',
        "[tabindex]",
        ".pointer-events-auto",
      ];

      return interactiveSelectors.some((selector) => {
        return element.matches(selector) || element.closest(selector);
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );

      // インタラクティブ要素をタッチした場合はカーソルを表示しない
      if (targetElement && isInteractiveElement(targetElement)) {
        touchedInteractiveElement = true;
        return;
      }

      touchedInteractiveElement = false;
      hasScrolled = false;
      startPosition = { x: touch.clientX, y: touch.clientY };
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      setIsPressed(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchedInteractiveElement) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startPosition.x);
      const deltaY = Math.abs(touch.clientY - startPosition.y);

      // スクロールの閾値（10px以上移動でスクロール判定）
      if (deltaX > 10 || deltaY > 10) {
        hasScrolled = true;
        setIsPressed(false);
        // スクロール時はカーソルを非表示
        setTouchPosition(null);
        return;
      }

      setTouchPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
      if (touchedInteractiveElement) return;

      setIsPressed(false);

      // スクロールしていない場合のみonTapを実行
      if (!hasScrolled) {
        onTap();
      }

      // 少し遅延してカーソルを非表示にする
      touchTimeoutRef.current = setTimeout(() => {
        setTouchPosition(null);
      }, 200);
    };

    const handleTouchCancel = () => {
      setIsPressed(false);
      touchTimeoutRef.current = setTimeout(() => {
        setTouchPosition(null);
      }, 200);
    };

    layer.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    layer.addEventListener("touchmove", handleTouchMove, { passive: false });
    layer.addEventListener("touchend", handleTouchEnd);
    layer.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      layer.removeEventListener("touchstart", handleTouchStart);
      layer.removeEventListener("touchmove", handleTouchMove);
      layer.removeEventListener("touchend", handleTouchEnd);
      layer.removeEventListener("touchcancel", handleTouchCancel);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, [isMobile, onTap]);

  if (!isMobile || !touchPosition) return null;

  return (
    <div
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{
        left: touchPosition.x - 20,
        top: touchPosition.y - 20,
        transform: "translate(-75%, -75%)",
      }}
    >
      <div
        className={`w-16 h-16 rounded-full backdrop-blur-sm bg-close transition-all duration-150 ${
          isPressed ? "" : ""
        }`}
      />
    </div>
  );
}
