import { Link } from "react-router-dom";
import JohannesburgMap from "../components/JohannesburgMap";
import SEO from "../components/SEO";

const AREAS = [
  { name: "Soweto", blurb: "Fast LPG gas cylinder delivery across Soweto, every day of the week." },
  { name: "Sandton", blurb: "Reliable gas delivery in Sandton for homes, offices and restaurants." },
  { name: "Randburg", blurb: "LPG gas cylinders delivered to your door in Randburg, same day." },
  { name: "Roodepoort", blurb: "Order gas delivery in Roodepoort — cylinders refilled and delivered fast." },
  { name: "Midrand", blurb: "Gas delivery in Midrand for cooking, heating, and business use." },
  { name: "Alexandra", blurb: "Mashesha delivers LPG gas straight to your door in Alexandra." },
  { name: "Tembisa", blurb: "Same-day gas cylinder delivery across Tembisa, safe and reliable." },
  { name: "Boksburg", blurb: "Get LPG gas delivered in Boksburg — order online or by phone." },
  { name: "Germiston", blurb: "Gas delivery in Germiston for households and small businesses." },
  { name: "Edenvale", blurb: "LPG gas cylinders delivered fast across Edenvale." },
  { name: "Kempton Park", blurb: "Order gas delivery near Kempton Park, refilled to SANS standards." },
  { name: "Fourways", blurb: "Gas delivery in Fourways — cylinders for cooking and gas heaters." },
  { name: "Diepkloof", blurb: "Same-day LPG delivery for homes and businesses in Diepkloof." },
  { name: "Orange Farm", blurb: "Mashesha delivers gas cylinders to Orange Farm, fast and safe." },
  { name: "Naturena", blurb: "Reliable gas delivery in Naturena, refilled and delivered same day." },
  { name: "Lenasia", blurb: "LPG gas delivery in Lenasia for cooking and gas heaters." },
];

export default function LocationsPage() {
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <SEO
        title="Gas Delivery Near You — Johannesburg Areas We Serve | Mashesha"
        description="Mashesha delivers LPG gas to Soweto, Sandton, Randburg, Midrand and more. Find out if we deliver gas near you, anywhere across Johannesburg."
        path="/locations"
      />
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

        {/* Map */}
        <div className="mb-12">
          <JohannesburgMap />
          <p className="mt-3 text-xs text-charcoal/40 text-center">
            Mashesha Gas — Jeppestown, Johannesburg
          </p>
        </div>

        {/* Areas grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-16">
          {AREAS.map((area) => (
            <details
              key={area.name}
              className="group rounded-xl border border-charcoal/10 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium text-charcoal">{area.name}</span>
                <svg
                  viewBox="0 0 12 8"
                  className="h-2.5 w-2.5 flex-shrink-0 text-charcoal/30 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" />
                </svg>
              </summary>
              <p className="mt-2 text-xs text-charcoal/60 leading-relaxed">{area.blurb}</p>
            </details>
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
