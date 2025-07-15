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

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      setIsPressed(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
      // タップ効果を実行
      onTap();

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
      className={`fixed pointer-events-none z-50 ${className} bg-red-500`}
      style={{
        left: touchPosition.x - 20,
        top: touchPosition.y - 20,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* <div
        className={`w-10 h-10 rounded-full border-2 border-white/60 bg-white/20 backdrop-blur-sm transition-all duration-150 ${
          isPressed ? "scale-125 bg-white/30" : "scale-100"
        }`}
      /> */}
      <div
        className={`w-10 h-10 bg-close transition-all duration-150 ${
          isPressed ? "" : ""
        }`}
      />
    </div>
  );
}
