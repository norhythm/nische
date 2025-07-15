"use client";

import Link from "next/link";

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
      sessionStorage.setItem("isInternalNavigation", "true");
      sessionStorage.setItem("isWorkToWorkNavigation", "true");
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
