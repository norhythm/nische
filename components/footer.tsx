interface FooterProps {
  className: string;
}

export default function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`w-full xl:max-w-screen-xl mx-auto pt-8 md:pt-10 px-4 md:px-[8%] xl:px-[102px] pb-8 md:pb-8 text-xs text-gray-500 tracking-wider ${className}`}
    >
      <p>&copy; 2009 - {year} Tsukasa Kikuchi. All Rights Reserved.</p>
    </footer>
  );
}
