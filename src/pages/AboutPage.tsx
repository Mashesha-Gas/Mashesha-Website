import { Link } from "react-router-dom";

const VALUES = [
  {
    title: "Safety first",
    desc: "Every cylinder we handle is inspected and refilled to SANS safety standards. Your family's safety is never negotiable.",
  },
  {
    title: "Community rooted",
    desc: "We're a Johannesburg business serving Johannesburg people. We know the streets, we know the need.",
  },
  {
    title: "Always reliable",
    desc: "When you order from Mashesha, the gas shows up. No excuses, no delays — just fuel delivered on time.",
  },
  {
    title: "Fair pricing",
    desc: "Transparent prices, no hidden fees. You should know exactly what you're paying before you order.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-cream min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-rust py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            About us
          </span>
          <h1 className="font-display mt-4 text-5xl text-cream sm:text-6xl max-w-2xl">
            Keeping Johannesburg cooking.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Mashesha was built on a simple belief: safe, affordable energy should
            be easy to access — for every family, every kitchen, every business
            in Johannesburg.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-16 sm:grid-cols-2 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">
                Our story
              </span>
              <h2 className="font-display mt-4 text-4xl text-charcoal">
                Started in Joburg. Staying in Joburg.
              </h2>
              <p className="mt-6 text-charcoal/70 leading-relaxed">
                Mashesha started because we saw a gap — too many households were
                running out of gas with no easy way to get a refill fast. Lugging
                heavy cylinders to a garage or waiting days for delivery wasn't
                good enough.
              </p>
              <p className="mt-4 text-charcoal/70 leading-relaxed">
                We built a delivery-first gas service that puts the customer at
                the centre. Order by phone, WhatsApp, or online — and your gas
                arrives at your door the same day.
              </p>
            </div>
            <div className="rounded-2xl bg-rust p-10">
              <p className="font-display text-5xl text-cream">Mashesha.</p>
              <p className="mt-4 text-cream/75 text-sm leading-relaxed">
                "Mashesha" means <em>hurry</em> in Zulu — because that's what we
                do. When you're out of gas, we move fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-rust/10 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            What we stand for
          </span>
          <h2 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl">
            Our values.
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-charcoal/10 bg-cream p-7"
              >
                <h3 className="font-display text-xl text-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm text-charcoal/65 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-16 text-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-3xl text-charcoal">Ready to order?</h2>
          <p className="mt-4 text-charcoal/65">
            Browse our cylinders and get gas delivered to your door today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              See our products
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-charcoal/20 px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-200 hover:border-charcoal/50"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
