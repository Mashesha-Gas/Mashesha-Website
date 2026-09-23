import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import johannesburgSkyline from "../components/johannesburg-skyline.webp";
import johannesburgSkylineMobile from "../components/johannesburg-skyline-mobile.webp";
import logoIcon from "../components/logo-icon.webp";

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
    desc: "When you order from Mashesha, the gas shows up. No excuses, no delays, just fuel delivered on time.",
  },
  {
    title: "Fair pricing",
    desc: "Transparent prices, no hidden fees. You should know exactly what you're paying before you order.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-cream min-h-screen">
      <SEO
        title="About Mashesha | Johannesburg's Gas Delivery Service"
        description="Mashesha is a Johannesburg-based LPG gas delivery service. Learn how we keep homes and businesses stocked with safe, reliable gas for cooking and heating."
        path="/about"
      />
      {/* Hero */}
      <section className="hero-pattern-bg relative bg-rust bg-cover bg-center pt-32 pb-20 sm:pb-28 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            About us
          </span>
          <h1 className="font-display mt-4 text-5xl text-cream sm:text-6xl max-w-2xl">
            Keeping Johannesburg cooking.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Mashesha was built on a simple belief: safe, affordable energy should
            be easy to access, for every family, every kitchen, every business
            in Johannesburg.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-16 sm:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">
                Our story
              </span>
              <h2 className="font-display mt-4 text-4xl text-charcoal">
                Started in Joburg. Staying in Joburg.
              </h2>
              <p className="mt-6 text-charcoal/70 leading-relaxed">
                Mashesha has called Jeppestown home since 1963. For decades, this
                inner-city base has kept nearby households and businesses stocked
                with gas — long before "delivery" was a buzzword, it was just how
                we did business.
              </p>
              <p className="mt-4 text-charcoal/70 leading-relaxed">
                After some years away, we relaunched with the same name, the same
                Jeppestown roots, and a team that still believes gas shouldn't be
                hard to get. We're back doing what we've always done — serving the
                inner city first, with real people answering the phone and driving
                the deliveries.
              </p>
              <p className="mt-4 text-charcoal/70 leading-relaxed">
                Order by phone, WhatsApp, or online before noon, and your gas
                arrives at your door the same day, in our areas of operation. Pay
                by card on delivery (powered by Yoco), or collect it yourself from
                our Jules Street or Warrior Paint, Norwood stores instead.
              </p>
            </div>
            <div>
              <div
                role="img"
                aria-label="Mashesha logo"
                className="mx-auto h-36 w-36 opacity-70"
                style={{
                  backgroundColor: "var(--color-rust)",
                  WebkitMaskImage: `url(${logoIcon})`,
                  maskImage: `url(${logoIcon})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
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
                className="rounded-2xl bg-rust p-7"
              >
                <h3 className="font-display text-xl text-cream">{v.title}</h3>
                <p className="mt-3 text-sm text-cream/75 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skyline photo */}
      <section className="bg-cream">
        <img
          src={johannesburgSkyline}
          srcSet={`${johannesburgSkylineMobile} 1000w, ${johannesburgSkyline} 3200w`}
          sizes="100vw"
          alt="Johannesburg city skyline at dusk"
          loading="lazy"
          decoding="async"
          className="h-[28rem] w-full object-cover sm:h-[36rem]"
        />
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
