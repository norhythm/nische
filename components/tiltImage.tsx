"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import Image from "next/image";

interface FullScreenTiltImageProps {
  single?: boolean;
  article?: boolean;
  clip?: boolean;
  src: string;
  alt: string;
  width: number;
  height: number;
  parentClassName?: string;
  childClassName?: string;
  intensity?: number;
  tilt: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function extractAccentColor(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): string {
  const data = ctx.getImageData(0, 0, w, h).data;

  // hueを30度ごとに12バケットに分類
  const buckets: { hue: number; sat: number; light: number; count: number }[] =
    Array.from({ length: 12 }, () => ({ hue: 0, sat: 0, light: 0, count: 0 }));

  for (let i = 0; i < data.length; i += 16) {
    // 4pxおきにサンプリング
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    // 暗すぎ・明るすぎ・彩度なしを除外
    if (s < 0.12 || l < 0.08 || l > 0.92) continue;
    const idx = Math.floor(h / 30) % 12;
    buckets[idx].hue += h;
    buckets[idx].sat += s;
    buckets[idx].light += l;
    buckets[idx].count += 1;
  }

  // 彩度の加重スコアが最も高いバケットをアクセントカラーとして採用
  let best = buckets[0];
  let bestScore = 0;
  for (const b of buckets) {
    if (b.count === 0) continue;
    const avgSat = b.sat / b.count;
    // 彩度 × ピクセル数のルート（少数でも鮮やかなら差し色として採用）
    const score = avgSat * Math.sqrt(b.count);
    if (score > bestScore) {
      bestScore = score;
      best = b;
    }
  }

  if (best.count === 0) return "hsl(0, 0%, 30%)";

  const avgH = Math.round(best.hue / best.count);
  const avgS = Math.round((best.sat / best.count) * 100);
  const avgL = Math.round((best.light / best.count) * 100);
  // 彩度を強め、明度をやや暗めに調整して色面として映えるようにする
  return `hsl(${avgH}, ${Math.min(avgS + 15, 100)}%, ${Math.min(Math.max(avgL - 5, 20), 45)}%)`;
}

export default function FullScreenTiltImage({
  single,
  article,
  clip,
  src,
  alt,
  width,
  height,
  parentClassName = "",
  childClassName = "",
  intensity = 1,
  tilt,
}: FullScreenTiltImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tintImgRef = useRef<HTMLImageElement | null>(null);
  const accentColorRef = useRef<string>("hsl(0, 0%, 30%)");
  const reactId = useId();
  const maskId = `clip-mask-${reactId}`;

  const drawTintedImage = useCallback(
    (img: HTMLImageElement) => {
      if (!article) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 初回のみ色抽出
      if (!tintImgRef.current) {
        const sampleSize = 64;
        const sampleCanvas = document.createElement("canvas");
        sampleCanvas.width = sampleSize;
        sampleCanvas.height = sampleSize;
        const sampleCtx = sampleCanvas.getContext("2d")!;
        sampleCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
        accentColorRef.current = extractAccentColor(
          sampleCtx,
          sampleSize,
          sampleSize,
        );
        tintImgRef.current = img;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      // アクセントカラーで塗りつぶし（画像の不透明部分のみ）
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = accentColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 選択したブレンドモードで元画像を重ねる
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(img, 0, 0);
    },
    [article],
  );

  // article時のみ画像ロード＆描画
  useEffect(() => {
    if (!article) return;
    if (tintImgRef.current) {
      drawTintedImage(tintImgRef.current);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => drawTintedImage(img);
    img.src = src;
  }, [article, src, drawTintedImage]);

  // Handle images already loaded before hydration (e.g., cached or eager-loaded)
  useEffect(() => {
    if (imgElRef.current?.complete && imgElRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      let x: number, y: number;
      let centerX: number, centerY: number;

      if (single && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        centerX = rect.width / 2;
        centerY = rect.height / 2;
      } else {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        x = e.clientX;
        y = e.clientY;
        centerX = screenWidth / 2;
        centerY = screenHeight / 2;
      }

      const rotateX = (y - centerY) / centerY;
      const rotateY = (centerX - x) / centerX;

      const maxTilt = tilt * intensity;
      const tiltX = rotateX * maxTilt;
      const tiltY = rotateY * maxTilt;

      if (imageRef.current) {
        imageRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (single) {
        if (imageRef.current) {
          imageRef.current.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        }
      }
    };

    if (single && imageRef.current) {
      const element = imageRef.current;
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    } else {
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [intensity, tilt, single]);

  return (
    <div
      ref={imageRef}
      className={`relative ${parentClassName}`}
      style={{
        ...(article && { aspectRatio: `${width} / ${height}` }),
        ...(clip && { clipPath: `url(#${maskId})` }),
      }}
    >
      {clip && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id={maskId} clipPathUnits="objectBoundingBox">
              <path d="M0.011 0H0.989L1 0.011V0.989L0.989 1H0.011L0 0.989V0.011L0.011 0Z" />
            </clipPath>
          </defs>
        </svg>
      )}
      <Image
        ref={imgElRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        preload
        loading="eager"
        fetchPriority="high"
        onLoad={() => {
          setLoaded(true);
        }}
        className={`${childClassName} object-contain w-full h-full block transition-all duration-[100ms] ease-out rotate-[0.25deg] ${loaded ? "opacity-100 !rotate-[0deg]" : "opacity-0"}`}
      />
      {article && (
        <canvas
          ref={canvasRef}
          className={`${childClassName} absolute -z-1 object-contain w-full h-full block transition-all delay-[16ms] duration-[100ms] ease-out rotate-[2.8deg] ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
