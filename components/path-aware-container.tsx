"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PathAwareContainerProps {
  children: React.ReactNode;
}

export default function PathAwareContainer({ children }: PathAwareContainerProps) {
  const pathname = usePathname();
  const [pathClasses, setPathClasses] = useState<string>("");

  useEffect(() => {
    // パスからクラス名を生成
    const generatePathClasses = (path: string): string => {
      const segments = path.split("/").filter(Boolean);
      const classes: string[] = [];

      // ルートパスの場合
      if (segments.length === 0) {
        classes.push("page-root");
      } else {
        // 各セグメントをクラス名に追加
        segments.forEach((segment, index) => {
          // 特殊文字をサニタイズ
          const sanitizedSegment = segment.replace(/[^a-zA-Z0-9-_]/g, "-");
          classes.push(`path-${sanitizedSegment}`);
          
          // 階層情報も追加
          if (index === 0) {
            classes.push(`page-${sanitizedSegment}`);
          }
        });
        
        // 完全なパスのクラス
        const fullPath = segments.join("-");
        classes.push(`path-full-${fullPath}`);
      }

      return classes.join(" ");
    };

    setPathClasses(generatePathClasses(pathname));
  }, [pathname]);

  return (
    <div
      id="container"
      className={`min-h-screen flex flex-col ${pathClasses}`}
    >
      {children}
    </div>
  );
}