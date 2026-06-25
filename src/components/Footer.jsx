import FlameLogo from "./FlameLogo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 border-b border-cream/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-cream">
              <FlameLogo className="h-8 w-5 [--logo-skyline:#18251a]" />
              <span className="font-display text-lg">MASHESHA</span>
            </div>
            <p className="mt-4 text-sm text-cream/60">
              Safe, reliable, accessible energy that keeps Johannesburg moving.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li><a href="#products" className="transition-colors duration-200 hover:text-rust cursor-pointer">Products</a></li>
              <li><a href="#how-it-works" className="transition-colors duration-200 hover:text-rust cursor-pointer">How It Works</a></li>
              <li><a href="#why-mashesha" className="transition-colors duration-200 hover:text-rust cursor-pointer">Why Mashesha</a></li>
              <li><a href="#service-area" className="transition-colors duration-200 hover:text-rust cursor-pointer">Service Area</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li><a href="tel:+27111234567" className="transition-colors duration-200 hover:text-rust cursor-pointer">+27 11 123 4567</a></li>
              <li><a href="mailto:info@mashesha.co.za" className="transition-colors duration-200 hover:text-rust cursor-pointer">info@mashesha.co.za</a></li>
              <li>Johannesburg, South Africa</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/50">
              Promise
            </h3>
            <p className="mt-4 text-sm text-cream/75">
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
