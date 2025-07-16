"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TopScroller = () => {
  const pathname = usePathname();

  useEffect(() => {
    // window.scrollTo({
    //   top: 0,
    // });

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <></>;
};

export default TopScroller;
