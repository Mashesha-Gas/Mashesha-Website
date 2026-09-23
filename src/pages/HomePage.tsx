import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import orangePatternedBackground from "../components/orange-patterned-background.webp";
import logoIcon from "../components/logo-icon.webp";
import johannesburgAerial from "../components/johannesburg-aerial.jpg";
import QuickOrder from "../components/QuickOrder";
import { PaymentOptionsCard } from "../components/PaymentBadges";
import { CollectionOptionsCard } from "../components/CollectionOptions";
import { whatsAppLink } from "../utils/whatsapp";

export default function HomePage() {
  // Same-page anchor clicks (the hero button) already scroll natively.
  // This covers arriving from another page via a link like "/#order" —
  // React Router's client-side navigation doesn't trigger the browser's
  // usual scroll-to-hash behaviour, since no real page load happens.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  return (
    <main>
      <SEO
        title="Mashesha | Gas Delivery Near You | LPG Gas in Johannesburg"
        description="Mashesha delivers LPG gas cylinders straight to your door in Johannesburg. Fast, safe gas delivery for cooking, stoves and gas heaters. Order gas near you today."
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
            Started in Joburg, Staying in Joburg – Since 1963
          </h1>
          <p className="mt-3 font-display text-2xl text-cream/90">Gas shup shup.</p>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Serving the community from the inner city, bringing life back to the City.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#order"
              className="inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
            >
              Order gas now
            </a>
            <a
              href={whatsAppLink("Hi Mashesha, I'd like to order gas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/70"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-cream pt-20 sm:pt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-lg rounded-2xl bg-rust p-10 text-center">
            <p className="font-display text-5xl text-cream">Mashesha.</p>
            <p className="mt-4 text-cream/75 text-sm leading-relaxed">
              "Mashesha" means <em>hurry</em> in Zulu, because that's what we
              do. When you're out of gas, we move fast.
            </p>
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
                desc: "Order before noon and get your cylinder delivered the same day in our areas of operation.",
              },
              {
                title: "All cylinder sizes",
                desc: "From 1 kg camping cylinders to 18 kg family and 48kg business cylinders, we stock them all.",
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

      {/* Aerial shot of Johannesburg */}
      <section className="bg-cream">
        <img
          src={johannesburgAerial}
          alt="Aerial view of Johannesburg, the city Mashesha delivers gas across"
          className="h-[28rem] w-full object-cover sm:h-[36rem]"
        />
      </section>

      {/* Quick order */}
      <section id="order" className="relative bg-rust/10 py-20 sm:py-28 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[20rem] w-[20rem] opacity-30 sm:h-[26rem] sm:w-[26rem]"
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
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-rust">
              Order in 3 steps
            </span>
            <h2 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl">
              Get your gas delivered.
            </h2>
            <p className="mt-5 max-w-lg mx-auto text-charcoal/65">
              No account, no email — just your cylinder, your suburb, and your details.
            </p>
          </div>

          <div className="mt-12 max-w-xl mx-auto text-left">
            <QuickOrder />
          </div>

          <p className="mt-8 text-center">
            <Link to="/products" className="text-sm font-semibold text-rust hover:underline">
              Browse our full range →
            </Link>
          </p>

          {/* Size guidance */}
          <div className="mt-16 rounded-2xl bg-rust p-10 text-center">
            <h3 className="font-display text-3xl text-cream">
              Not sure which size you need?
            </h3>
            <p className="mt-4 text-cream/80 max-w-lg mx-auto">
              Call us or send a WhatsApp and we'll help you pick the right
              cylinder for your household or business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
              >
                Contact us
              </Link>
              <a
                href="tel:+27111234567"
                className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/70"
              >
                Call us
              </a>
              <a
                href={whatsAppLink("Hi Mashesha, I'm not sure which cylinder size I need. Can you help?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/70"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-6 max-w-4xl mx-auto sm:grid-cols-3">
            {[
              {
                title: "Same-day delivery",
                desc: "Order before noon and get your cylinder delivered the same day in our areas of operation.",
              },
              {
                title: "Scheduled delivery",
                desc: "Prefer a specific time slot? We can arrange a morning or afternoon delivery.",
              },
              {
                title: "Not in our area?",
                desc: "Call us. We're always expanding, and we may be able to make a plan.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-rust p-7">
                <h3 className="font-display text-xl text-cream">{item.title}</h3>
                <p className="mt-3 text-sm text-cream/75 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 text-left max-w-4xl mx-auto sm:grid-cols-2">
            <CollectionOptionsCard />
            <PaymentOptionsCard />
          </div>
        </div>
      </section>
    </main>
  );
}
