import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import orangePatternedBackground from "../components/orange-patterned-background.webp";

export default function HomePage() {
  return (
    <main>
      <SEO
        title="Mashesha — Gas Delivery Near You | LPG Gas in Johannesburg"
        description="Mashesha delivers LPG gas cylinders straight to your door in Johannesburg. Fast, safe gas delivery for cooking, stoves and gas heaters — order gas near you today."
        path="/"
      />
      {/* Hero */}
      <section
        className="relative bg-rust min-h-screen flex items-center pt-20 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${orangePatternedBackground})` }}
      >
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/80">
            Johannesburg's gas delivery service
          </span>
          <h1 className="font-display mt-4 text-5xl text-cream sm:text-7xl max-w-3xl leading-tight">
            Gas when you need it. Where you need it.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Mashesha delivers refilled LPG cylinders straight to your door — fast,
            safe, and available across Johannesburg.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
            >
              See our cylinders
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/70"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Mashesha */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Why Mashesha
          </span>
          <h2 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl max-w-xl">
            Simple. Reliable. Yours.
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Same-day delivery",
                desc: "Order before noon and get your cylinder delivered the same day across most of Johannesburg.",
              },
              {
                title: "All cylinder sizes",
                desc: "From 1 kg camping cylinders to 18 kg family and business cylinders — we stock them all.",
              },
              {
                title: "Safe & certified",
                desc: "Every refill meets SANS safety standards. We never cut corners on the gas you cook with.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t-2 border-rust pt-6">
                <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm text-charcoal/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products teaser */}
      <section className="bg-rust/10 py-20 sm:py-28 text-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Our range
          </span>
          <h2 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl">
            A cylinder for every need.
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-charcoal/65">
            Whether you're camping, cooking for the family, or running a small
            restaurant — Mashesha has the right size.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
          >
            View all products →
          </Link>
        </div>
      </section>
    </main>
  );
}
