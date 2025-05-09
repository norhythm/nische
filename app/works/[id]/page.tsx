"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import works from "@/data/works.json";

export default function WorkDetail({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const unwrapParams = use(params);
  const work = works.find((w) => w.id == unwrapParams.id);

  if (!work) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Work Detail */}
      <section className="container mx-auto px-4 md:px-8 pt-8 md:pt-0 mb-20">
        <div className="mx-auto">
          <h1 className="text-lg md:text-2xl tracking-wider mb-2">
            {work.title}
          </h1>
          <p className="text-sm md:text-lg tracking-wider mb-12">
            {work.credit}
          </p>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full"></div>
            <div className="relative py-16 w-full z-20 flex justify-center items-center">
              <Image
                src={`/images/works/${work.image}` || "/placeholder.svg"}
                alt={work.title}
                width={512}
                height={512}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                className="object-cover z-20 shadow-lg w-3/4"
                priority
                onLoadingComplete={(image) => {
                  // Find the parent element and remove the loading indicator
                  const parent = image.parentElement?.parentElement;
                  if (parent) {
                    const loadingEl = parent.querySelector(".animate-pulse");
                    if (loadingEl) loadingEl.classList.add("hidden");
                  }
                }}
              />
            </div>
          </div>

          <div className="pt-10 mb-8">
            <h2 className="text-lg md:text-xl tracking-wider mb-4">
              {work.title}
            </h2>
            <p className="text-sm md:text-base tracking-wider mb-2">
              {work.credit}
            </p>

            {/* {work.url && (
              <p className="mb-4">
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 underline"
                >
                  {work.url}
                </a>
              </p>
            )} */}
          </div>
        </div>
      </section>
    </main>
  );
}
