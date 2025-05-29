"use client";

import Image from "next/image";
import Link from "next/link";

import works from "@/data/works.json";

export default function Home() {
  return (
    <main className="">
      <div className="sticky top-[100px] container mx-auto px-8 z-50">
        All - Rec - Mix - Mastering
      </div>
      {/* Works Grid */}
      <section id="works" className="container mx-auto px-4 pt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 group/works pointer-events-none">
          {/* {works.slice(0, 15).map((work, index) => ( */}
          {works.map((work, index) => (
            <Link
              href={`/works/${work.id}`}
              key={work.id}
              className={`${
                index % 3 === 0 ? "col-span-2 md:col-span-1" : "col-span-1"
              }
              work-item relative cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto
               "`}
            >
              <div className="relative flex justify-center items-center aspect-square overflow-hidden">
                <div
                  className={`absolute overflow-hidden flex justify-center items-center bg-hero layout-${work.layout}`}
                >
                  <Image
                    src={`/images/works/${work.image}` || "/placeholder.svg"}
                    alt={work.title}
                    width={512}
                    height={512}
                    // fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    // className="absolute w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                    className="drop-shadow-md group-hover/item:scale-105 transition-transform duration-500"
                    onLoadingComplete={(image) => {
                      // Find the parent element and remove the loading indicator
                      const parent = image.parentElement?.parentElement;
                      if (parent) {
                        const loadingEl =
                          parent.querySelector(".animate-pulse");
                        if (loadingEl) loadingEl.classList.add("hidden");
                      }
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
