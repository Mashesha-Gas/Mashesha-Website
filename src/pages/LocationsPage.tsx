import { Link } from "react-router-dom";

const AREAS = [
  "Soweto", "Sandton", "Randburg", "Roodepoort", "Midrand", "Alexandra",
  "Tembisa", "Boksburg", "Germiston", "Edenvale", "Kempton Park", "Fourways",
  "Diepkloof", "Orange Farm", "Naturena", "Lenasia",
];

export default function LocationsPage() {
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Page header */}
        <div className="py-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Delivery areas
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            We deliver across Johannesburg.
          </h1>
          <p className="mt-5 text-lg text-charcoal/65">
            Mashesha covers most of Johannesburg and the surrounding areas.
            If your area isn't listed, contact us — we may still be able to help.
          </p>
        </div>

        {/* Areas grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-16">
          {AREAS.map((area) => (
            <div
              key={area}
              className="rounded-xl border border-charcoal/10 bg-white px-5 py-4"
            >
              <span className="text-sm font-medium text-charcoal">{area}</span>
            </div>
          ))}
        </div>

        {/* Delivery info */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          {[
            {
              title: "Same-day delivery",
              desc: "Order before noon and we'll deliver the same day in most areas.",
            },
            {
              title: "Scheduled delivery",
              desc: "Prefer a specific time slot? We can arrange a morning or afternoon delivery.",
            },
            {
              title: "Not in our area?",
              desc: "Call us — we're always expanding. We may be able to make a plan.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-charcoal/10 bg-white p-7"
            >
              <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm text-charcoal/65 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-rust p-10 text-center">
          <h2 className="font-display text-3xl text-cream">
            Ready for a delivery?
          </h2>
          <p className="mt-4 text-cream/80 max-w-md mx-auto">
            Order online or call us and we'll have gas at your door today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
            >
              Order now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/70"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
