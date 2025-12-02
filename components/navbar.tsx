"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mt-4 bg-transparent">
      <div className="flex justify-center items-center gap-8 py-4">
        <Link
          href="/"
          className={`text-3xl hover:text-foreground/80 hover:font-bold transition-all ${
            pathname === "/" ? "font-bold" : "font-light text-foreground/60"
          }`}
        >
          World Map
        </Link>
        <Link
          href="/saved-pins"
          className={`text-3xl hover:text-foreground/100 hover:font-bold transition-all ${
            pathname === "/saved-pins"
              ? "font-bold"
              : "font-light text-foreground/60"
          }`}
        >
          Saved Pins
        </Link>
      </div>
    </nav>
  );
}
