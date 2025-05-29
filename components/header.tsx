import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 py-4 md:py-[60px] md:px-4">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <h1 className="md:text-xl font-medium text-base flex justify-content items-center tracking-wider">
          <Link
            href="/"
            className="hover:text-gray-500 cursor-pointer transition-colors uppercase"
          >
            <span className="font-base">Tsukasa Kikuchi</span>
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-base">
            <li>
              <Link
                href="/biography/"
                className="hover:text-gray-500 transition-colors"
              >
                Biography
              </Link>
            </li>
            <li>
              <Link
                href="/contact/"
                className="hover:text-gray-500 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
