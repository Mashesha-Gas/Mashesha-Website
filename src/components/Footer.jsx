import { Link } from "react-router-dom";
import FlameLogo from "./FlameLogo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-rust pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Main content */}
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Brand block */}
          <div>
            <div className="flex items-center gap-2.5 text-cream">
              <FlameLogo className="h-7 w-5 text-cream [--logo-skyline:#b14305]" />
              <span className="font-display text-lg tracking-wide">MASHESHA GAS</span>
            </div>
            <Link
              to="/contact"
              className="mt-2 inline-block text-sm font-semibold text-cream/80 hover:text-cream transition-colors duration-200"
            >
              Get in touch with us →
            </Link>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/50">Contact</p>
            <ul className="mt-3 space-y-1.5 text-sm text-cream/80">
              <li><a href="tel:+27111234567" className="hover:text-cream transition-colors duration-200">+27 11 123 4567</a></li>
              <li><a href="mailto:info@mashesha.co.za" className="hover:text-cream transition-colors duration-200">info@mashesha.co.za</a></li>
              <li>Jeppestown, Johannesburg</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/50">Disclaimer</p>
            <p className="mt-3 text-sm text-cream/70 leading-relaxed">
              All gas deliveries comply with South African LPG safety regulations (SANS 10087).
              Prices are subject to change without notice.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 border-t border-cream/15 pt-5 text-center text-xs text-cream/35">
          © {year} Mashesha Gas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
