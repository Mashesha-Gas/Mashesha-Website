import { Link } from "react-router-dom";

const CYLINDERS = [
  {
    size: "1kg",
    tagline: "Portable & camping",
    desc: "Perfect for camping trips, outdoor braais, and single-burner stoves. Lightweight enough to pack in a bag.",
    image: "/images/cylinder-1kg.jpg",
  },
  {
    size: "3kg",
    tagline: "Small household & backup",
    desc: "Ideal for singles, small apartments, and keeping a backup cylinder on hand at all times.",
    image: "/images/cylinder-3kg.jpg",
  },
  {
    size: "12kg",
    tagline: "Everyday household cooking",
    desc: "Our most popular size — built for daily cooking and water heating in a typical South African home.",
    image: "/images/cylinder-12kg.jpg",
  },
  {
    size: "18kg",
    tagline: "Large family & small business",
    desc: "Steady supply for bigger families, guesthouses, and small eateries that can't afford to run dry.",
    image: "/images/cylinder-18kg.jpg",
  },
];

function ProductImage({ src, size }: { src: string; size: string }) {
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-rust/8 border border-rust/10">
      <img
        src={src}
        alt={`Mashesha ${size} gas cylinder`}
        className="w-full h-full object-contain p-4"
        onError={(e) => {
          // Hide the broken image and show the placeholder behind it
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Placeholder sits behind the image — visible when image fails or is missing */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-rust/40">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <circle cx="12" cy="13" r="3" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
        <span className="text-xs font-medium">{size} photo</span>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Page header */}
        <div className="max-w-2xl py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Products
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Our gas cylinders.
          </h1>
          <p className="mt-5 text-lg text-charcoal/65">
            Mashesha stocks four cylinder sizes — from portable 1 kg canisters to
            large 18 kg tanks for homes and businesses. Click any size to learn more.
          </p>
        </div>

        {/* Cylinder cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CYLINDERS.map((cyl) => (
            <Link
              key={cyl.size}
              to={`/products/${cyl.size}`}
              className="group flex flex-col rounded-2xl border border-charcoal/10 bg-white overflow-hidden transition-colors duration-200 hover:border-rust/50 hover:bg-rust/5"
            >
              {/* Product image */}
              <ProductImage src={cyl.image} size={cyl.size} />

              {/* Card text */}
              <div className="flex flex-col flex-1 p-6">
                <span className="font-display text-4xl text-charcoal">{cyl.size}</span>
                <span className="mt-2 text-sm font-semibold text-rust">{cyl.tagline}</span>
                <p className="mt-3 text-sm text-charcoal/65 leading-relaxed flex-1">{cyl.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal transition-colors duration-200 group-hover:text-rust">
                  View details
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Order CTA */}
        <div className="mt-16 rounded-2xl bg-rust p-10 text-center">
          <h2 className="font-display text-3xl text-cream">
            Not sure which size you need?
          </h2>
          <p className="mt-4 text-cream/80 max-w-lg mx-auto">
            Call us or send a WhatsApp and we'll help you pick the right cylinder
            for your household or business.
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
          </div>
        </div>
      </div>
    </main>
  );
}
