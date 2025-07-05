import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 py-8 md:py-[60px] mix-blend-difference">
        <div className="container md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <h1 className="md:text-xl font-medium text-base flex justify-content items-center tracking-wider">
            <Link
              href="/"
              className="text-white hover:text-gray-600 cursor-pointer transition-colors uppercase"
              style={{ color: "#e4ffec" }}
            >
              <span className="font-base">Tsukasa Kikuchi</span>
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-base tracking-wider">
              <li className="text-white" style={{ color: "#e4ffec" }}>
                全体が変わるよ
              </li>
              <li>
                <Link
                  href="/biography/"
                  className="text-white hover:text-gray-600 transition-colors"
                  style={{ color: "#e4ffec" }}
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className="text-white hover:text-gray-600 transition-colors"
                  style={{ color: "#e4ffec" }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <header className="sticky top-20 left-0 right-0 z-50 py-8 md:py-[60px] mix-blend-difference">
        <div className="container md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <h1 className="md:text-xl font-medium text-base flex justify-content items-center tracking-wider">
            <Link
              href="/"
              className="text-white hover:text-gray-600 cursor-pointer transition-colors uppercase"
              style={{ color: "#e4ffec" }}
            >
              <span className="font-base">Tsukasa Kikuchi</span>
            </Link>
            <span className="text-white" style={{ color: "#e4ffec" }}>
              ここだけ変わるよ
            </span>
          </h1>
        </div>
      </header>
      <header className="sticky top-20 left-0 right-0 z-50 py-8 md:py-[60px]">
        <div className="container md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <nav className="ml-auto">
            <ul className="flex space-x-4 md:space-x-8 pb-[2px] text-sm md:text-base tracking-wider">
              <li>
                <Link
                  href="/biography/"
                  className="hover:text-gray-600  transition-colors"
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
    </>
  );
}
