export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container mx-auto pt-24 px-4 pb-4 md:px-8 md:pb-8 text-xs text-gray-500">
      <p>&copy; 2009 - {year} Tsukasa Kikuchi. All Rights Reserved.</p>
    </footer>
  );
}
