"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectedTagContext } from "@/lib/selected-tag-context";

export default function Header() {
  const pathname = usePathname();
  const { setSelectedTag } = useSelectedTagContext();

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 w-full xl:max-w-screen-xl mx-auto py-6 md:py-[60px] md:px-[8%] xl:px-[102px] pointer-events-none">
        <div className="px-4 md:px-0 flex justify-between items-center">
          <h1
            className={`md:text-xl font-medium text-base flex justify-content items-center tracking-wider`}
          >
            <Link
              href={"/"}
              className={`hover:text-gray-500 cursor-pointer transition-colors uppercase pointer-events-auto`}
              onClick={() => {
                setSelectedTag(null);
              }}
            >
              Tsukasa Kikuchi
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-[18px] tracking-wider">
              <li>
                <Link
                  href="/biography/"
                  className={`hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto ${
                    pathname === "/biography" ? "" : ""
                  }`}
                  onClick={() => {
                    setSelectedTag(null);
                  }}
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className={`hover:text-gray-500 transition-colors duration-300 ease-in-out pointer-events-auto ${
                    pathname === "/contact" ? "" : ""
                  }`}
                  onClick={() => {
                    setSelectedTag(null);
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
