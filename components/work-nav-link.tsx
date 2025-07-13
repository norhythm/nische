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
  const searchParams = useSearchParams();
  const [linkHref, setLinkHref] = useState(href);

  useEffect(() => {
    // fromTagパラメータまたはsessionStorageからタグを取得
    const fromTag = searchParams.get("fromTag");
    const savedTag =
      typeof window !== "undefined"
        ? sessionStorage.getItem("selectedTag")
        : null;

    // back-component.tsxと同じ優先順位でタグを決定
    const tagToUse = fromTag || savedTag;

    // タグがある場合は必ずfromTagパラメータとして次のページに渡す
    if (tagToUse) {
      setLinkHref(`${href}?fromTag=${tagToUse}`);
    } else {
      setLinkHref(href);
    }
  }, [href, searchParams]);

  const handleClick = () => {
    // サイト内遷移フラグを設定
    if (typeof window !== "undefined") {
      sessionStorage.setItem("isInternalNavigation", "true");
    }
  };

  return (
    <Link href={linkHref} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
