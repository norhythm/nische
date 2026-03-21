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
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
