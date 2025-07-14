"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function WorkNavLink({
  href,
  children,
  className,
}: WorkNavLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      // サイト内遷移フラグを設定
      sessionStorage.setItem("isInternalNavigation", "true");
      // 詳細ページ間遷移であることを記録
      sessionStorage.setItem("isWorkToWorkNavigation", "true");
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
