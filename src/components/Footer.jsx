import { Link } from "react-router-dom";
import FlameLogo from "./FlameLogo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-rust pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 border-b border-cream/20 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-cream">
              <FlameLogo className="h-8 w-5 text-cream [--logo-skyline:#b14305]" />
              <span className="font-display text-lg">MASHESHA GAS</span>
            </div>
            <p className="mt-4 text-sm text-cream/70">
              Safe, reliable, accessible energy that keeps Johannesburg moving.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
              <li><Link to="/products" className="transition-colors duration-200 hover:text-cream">Our Cylinders</Link></li>
              <li><Link to="/about" className="transition-colors duration-200 hover:text-cream">About Us</Link></li>
              <li><Link to="/locations" className="transition-colors duration-200 hover:text-cream">Delivery Areas</Link></li>
              <li><Link to="/contact" className="transition-colors duration-200 hover:text-cream">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
              <li><a href="tel:+27111234567" className="transition-colors duration-200 hover:text-cream">+27 11 123 4567</a></li>
              <li><a href="mailto:info@mashesha.co.za" className="transition-colors duration-200 hover:text-cream">info@mashesha.co.za</a></li>
              <li>Johannesburg, South Africa</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Promise
            </h3>
            <p className="mt-4 text-sm text-cream/80">
              Proudly Johannesburg. Proudly Mashesha.
            </p>
          </div>
        </div>

        <p className="pt-6 text-center text-xs text-cream/40">
          © {year} Mashesha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
