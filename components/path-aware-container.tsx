"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface PathAwareContainerProps {
  children: React.ReactNode;
}

const generatePathClasses = (path: string): string => {
  const segments = path.split("/").filter(Boolean);
  const classes: string[] = [];

  if (segments.length === 0) {
    classes.push("page-root");
  } else {
    segments.forEach((segment, index) => {
      const sanitizedSegment = segment.replace(/[^a-zA-Z0-9-_]/g, "-");
      classes.push(`path-${sanitizedSegment}`);

      if (index === 0) {
        classes.push(`page-${sanitizedSegment}`);
      }
    });

    const fullPath = segments.join("-");
    classes.push(`path-full-${fullPath}`);
  }

  return classes.join(" ");
};

export default function PathAwareContainer({
  children,
}: PathAwareContainerProps) {
  const pathname = usePathname();
  const pathClasses = useMemo(() => generatePathClasses(pathname), [pathname]);

  return (
    <div id="container" className={`h-dvh ${pathClasses}`}>
      {children}
    </div>
  );
}
