import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-[72px] font-medium leading-none tracking-tight text-[#222]">
          404
        </h1>
        <p className="mt-2 text-[14px] md:text-[16px] text-[#888]">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-2 border border-[#ddd] transition-colors hover:border-gray-800 cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
