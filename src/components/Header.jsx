import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoIcon from "./logo-icon.png";
import nameSlogan from "./nameslogan-cropped.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Our Cylinders" },
  { to: "/about", label: "About Us" },
  { to: "/locations", label: "Delivery Areas" },
  { to: "/contact", label: "Contact Us" },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartBadge({ count }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-cream px-1 text-[10px] font-bold text-rust">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function UserAvatar({ name }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-xs font-semibold text-rust">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

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

  const profileLink = user ? "/profile" : "/login";
  const profileLabel = user ? `Profile (${user.name})` : "Log in";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-3 transition-colors duration-300 sm:px-8 ${
          scrolled ? "bg-rust/95 backdrop-blur-sm shadow-lg" : "bg-rust"
        }`}
      >

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
          aria-label="Mashesha home"
        >
          <img src={logoIcon} alt="" className="h-9 w-auto" />
          <img src={nameSlogan} alt="Mashesha — Gas shup shup." className="h-7 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-charcoal font-bold" : "text-cream/80 hover:text-cream"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: profile, cart, order button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to={profileLink}
            aria-label={profileLabel}
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream/80 transition-colors duration-200 hover:bg-cream/10 hover:text-cream"
          >
            {user ? <UserAvatar name={user.name} /> : <ProfileIcon />}
          </Link>
          <Link
            to="/cart"
            aria-label="My cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-cream/80 transition-colors duration-200 hover:bg-cream/10 hover:text-cream"
          >
            <CartIcon />
            <CartBadge count={cartCount} />
          </Link>
          {/* Button flips to cream background so it stands out against the rust header */}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center justify-center rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
          >
            Order Gas
          </Link>
        </div>

        {/* Mobile: profile + cart icons + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to={profileLink}
            onClick={() => setOpen(false)}
            aria-label={profileLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/80 hover:text-cream"
          >
            {user ? <UserAvatar name={user.name} /> : <ProfileIcon />}
          </Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            aria-label="My cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream/80 hover:text-cream"
          >
            <CartIcon />
            <CartBadge count={cartCount} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-x-0 top-[60px] bottom-0 overflow-y-auto border-t border-charcoal/20 bg-rust px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-cream/10 text-cream font-bold"
                      : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-cream px-5 py-3 text-base font-semibold text-rust"
            >
              Order Gas
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
