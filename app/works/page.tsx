"use client";

import Image from "next/image";
import Link from "next/link";

import works from "@/data/works.json";

export default function Home() {
  return (
    <main className="">
      {/* Works Grid */}
      <section id="works" className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 group">
          {works.map((work) => (
            <Link
              href={`/works/${work.id}`}
              key={work.id}
              className="work-item relative cursor-pointer"
            >
              <div className="relative flex justify-center items-center aspect-square overflow-hidden group-hover:opacity-25 hover:!opacity-100 transition-opacity duration-300">
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
                    className="drop-shadow-md"
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
        <div className="text-right mt-8">
          <p className="text-sm text-gray-500">
            <Link
              href="/works/"
              className="hover:text-gray-500 cursor-pointer transition-colors"
            >
              - More works
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
