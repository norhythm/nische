export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container md:max-w-5xl mt-auto mx-auto pt-10 md:pt-24 px-4 pb-4 md:px-8 md:pb-8 text-xs text-gray-500 tracking-wider">
      <p>&copy; 2009 - {year} Tsukasa Kikuchi. All Rights Reserved.</p>
    </footer>
  );
}
