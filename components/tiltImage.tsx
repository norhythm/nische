"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface FullScreenTiltImageProps {
  single?: boolean;
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

export default function FullScreenTiltImage({
  single,
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
  const [transform, setTransform] = useState("");
  const imageRef = useRef<HTMLDivElement>(null);
  const maskId = `clip-mask`;

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

      setTransform(
        `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      );
    };

    const handleMouseLeave = () => {
      if (single) {
        setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
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
        transform,
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
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${childClassName} transition-all duration-300 ease-out`}
      />
    </div>
  );
}
