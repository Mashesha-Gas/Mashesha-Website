import { useEffect, useState } from "react";
import FlameLogo from "./FlameLogo";

const NAV_LINKS = [
  { href: "#products", label: "Products" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-mashesha", label: "Why Mashesha" },
  { href: "#service-area", label: "Service Area" },
  { href: "#contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/95 backdrop-blur-sm shadow-lg" : "bg-ink"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 text-cream cursor-pointer"
          aria-label="Mashesha home"
        >
          <FlameLogo className="h-9 w-6 text-cream [--logo-skyline:#18251a]" />
          <span className="font-display text-xl tracking-wide">MASHESHA</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/85 transition-colors duration-200 hover:text-rust cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-rust px-5 py-2.5 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark cursor-pointer"
          >
            Order Gas
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-cream lg:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[60px] bottom-0 overflow-y-auto border-t border-cream/10 bg-ink px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-rust cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-rust px-5 py-3 text-base font-semibold text-cream cursor-pointer"
            >
              Order Gas
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
