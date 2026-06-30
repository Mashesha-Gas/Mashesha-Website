import { useParams, Link, Navigate } from "react-router-dom";
import CylinderIcon from "../components/CylinderIcon";

const CYLINDERS = {
  "1kg": {
    size: "1kg",
    tagline: "Portable & camping",
    description:
      "The lightest cylinder in the Mashesha range — ideal for camping trips, picnics, and outdoor cooking. Small enough to pack in a bag, powerful enough to fuel your adventure.",
    features: [
      "Ultra-lightweight — under 2 kg when full",
      "Perfect for single-burner camping stoves",
      "Great for outdoor braais and picnics",
      "Compact — fits in any bag or small space",
    ],
    bestFor: ["Campers & hikers", "Single-burner stoves", "Outdoor events", "Backup supply"],
    iconHeight: "h-20",
  },
  "3kg": {
    size: "3kg",
    tagline: "Small household & backup",
    description:
      "Designed for singles, small apartments, and anyone who wants a backup cylinder always on hand. Compact enough to slip under a kitchen counter.",
    features: [
      "Compact and easy to store anywhere",
      "Ideal for one or two people",
      "Great backup while your main cylinder refills",
      "Lightweight — easy to carry and swap",
    ],
    bestFor: ["Singles & couples", "Small apartments", "Backup supply", "Spaza shops"],
    iconHeight: "h-28",
  },
  "12kg": {
    size: "12kg",
    tagline: "Everyday household cooking",
    description:
      "Our most popular size — built for daily cooking in a typical South African household. Lasts weeks of regular cooking and water heating without the fuss.",
    features: [
      "Most popular cylinder size in South Africa",
      "Lasts 4–6 weeks with regular household use",
      "Compatible with all standard gas appliances",
      "Available for fast refill or same-day swap",
    ],
    bestFor: ["Families of 3–5", "Daily cooking", "Water heating", "Regular gas users"],
    iconHeight: "h-40",
  },
  "18kg": {
    size: "18kg",
    tagline: "Large family & small business",
    description:
      "Steady, reliable supply for large families, guesthouses, and small eateries. Fewer refills, more cooking — exactly what high-use homes and businesses need.",
    features: [
      "Extended supply for high-use households",
      "Ideal for guesthouses, B&Bs and lodges",
      "Suits small restaurants and catering kitchens",
      "Reduces how often you need a refill",
    ],
    bestFor: ["Large families", "Guesthouses & B&Bs", "Small restaurants", "Catering operations"],
    iconHeight: "h-48",
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 flex-shrink-0 text-rust" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}

function ProductDetailPage() {
  const { size } = useParams();
  const product = CYLINDERS[size];

  if (!product) return <Navigate to="/" replace />;

  const otherSizes = Object.values(CYLINDERS).filter((c) => c.size !== product.size);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-cream pt-24 pb-0">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="flex items-center gap-2 text-sm text-charcoal/50" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors duration-200 hover:text-rust">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition-colors duration-200 hover:text-rust">Products</Link>
            <span>/</span>
            <span className="text-charcoal">{product.size} Cylinder</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-end">
            <div className="flex flex-shrink-0 items-end justify-center">
              <CylinderIcon className={`${product.iconHeight} w-auto text-rust`} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">Gas Cylinder</span>
              <h1 className="font-display mt-3 text-6xl text-charcoal sm:text-7xl">{product.size}</h1>
              <p className="mt-2 text-xl font-semibold text-charcoal/60">{product.tagline}</p>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/65">{product.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
                >
                  Order this size
                </Link>
                <Link to="/products" className="text-sm font-semibold text-charcoal/60 transition-colors duration-200 hover:text-charcoal">
                  ← Back to all products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Best For */}
      <section className="bg-rust/10 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">What you get</span>
              <h2 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl">Why the {product.size} works.</h2>
              <ul className="mt-8 space-y-4">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-base text-charcoal/75">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">Best for</span>
              <h2 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl">Who orders this size.</h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {product.bestFor.map((label) => (
                  <span key={label} className="rounded-full border border-rust/30 bg-rust/10 px-4 py-2 text-sm font-medium text-charcoal">
                    {label}
                  </span>
                ))}
              </div>

              {/* Help card */}
              <div className="mt-12 rounded-2xl bg-rust p-7">
                <p className="text-sm font-semibold uppercase tracking-widest text-cream/70">Need help choosing?</p>
                <p className="mt-3 text-base text-cream/85">
                  Not sure if the {product.size} is right for you? Call us or send a WhatsApp —
                  we'll recommend the best size for your situation.
                </p>
                <a href="tel:+27111234567" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cream transition-colors duration-200 hover:text-cream/70">
                  Call us now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse other sizes */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-rust">Not quite right?</p>
          <h2 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl">Browse other sizes.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {otherSizes.map((c) => (
              <Link
                key={c.size}
                to={`/products/${c.size}`}
                className="group flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-8 py-6 transition-colors duration-200 hover:border-rust/50 hover:bg-rust/5"
              >
                <CylinderIcon className={`${c.iconHeight} w-auto text-rust transition-transform duration-200 group-hover:-translate-y-1`} />
                <span className="font-display mt-4 text-xl text-charcoal">{c.size}</span>
                <span className="mt-1 text-xs text-rust">{c.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetailPage;
