import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import orangePatternedBackground from "../components/orange-patterned-background.webp";
import logoIcon from "../components/logo-icon.webp";
import johannesburgAerial from "../components/johannesburg-aerial.jpg";
import { useInventoryList, resolveImageUrl, CYLINDER_TYPE } from "../hooks/useInventory";
import { useCart } from "../context/CartContext";

interface InventoryRow {
  inventory_id: number;
  inventory_name: string;
  inventory_description: string | null;
  inventory_size: string | null;
  inventory_price: number | string | null;
  inventory_sale: number | string | null;
  inventory_quantity: number | string | null;
  inventory_type: string | null;
  inventory_brand: string | null;
  inventory_thumbnail_path: string | null;
}

function formatPrice(item: InventoryRow) {
  const price = Number(item.inventory_price);
  const sale = item.inventory_sale != null ? Number(item.inventory_sale) : null;
  if (sale != null && sale < price) {
    return `R ${sale.toLocaleString()} (was R ${price.toLocaleString()})`;
  }
  return `R ${price.toLocaleString()}`;
}

function ProductPreviewCard({ item }: { item: InventoryRow }) {
  const { addItem } = useCart();
  const [failed, setFailed] = useState(false);
  const [added, setAdded] = useState(false);
  const label = item.inventory_size || item.inventory_name;
  const src = resolveImageUrl(item.inventory_thumbnail_path);
  const showImage = src && !failed;
  const inStock = Number(item.inventory_quantity) > 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/products/${item.inventory_id}`}
      className="group flex flex-col rounded-2xl border border-cream/10 bg-ink overflow-hidden text-left transition-colors duration-200 hover:border-rust/50 hover:bg-ink-light"
    >
      <div className="relative w-full h-40 bg-cream/60">
        {showImage && (
          <img
            src={src}
            alt={`Mashesha ${label} gas cylinder`}
            className="w-full h-full object-contain p-4"
            onError={() => setFailed(true)}
          />
        )}
        {!showImage && (
          <div className="absolute inset-0 flex items-center justify-center text-rust/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <circle cx="12" cy="13" r="3" />
              <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="font-display text-2xl text-cream">{label}</span>
        <span className="mt-1 text-sm font-semibold text-rust">{formatPrice(item)}</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className="mt-4 rounded-full bg-rust px-4 py-2 text-xs font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-40 disabled:hover:bg-rust disabled:cursor-not-allowed"
        >
          {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { items, loading, error } = useInventoryList();
  const cylinders = items.filter((item: InventoryRow) => item.inventory_type === CYLINDER_TYPE).slice(0, 4);

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
            Gas when you need it. Where you need it.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Mashesha delivers refilled LPG cylinders straight to your door. Fast,
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
                desc: "From 1 kg camping cylinders to 18 kg family and business cylinders, we stock them all.",
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

      {/* Products teaser */}
      <section className="relative bg-rust/10 py-20 sm:py-28 text-center overflow-hidden">
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
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Our range
          </span>
          <h2 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl">
            A cylinder for every need.
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-charcoal/65">
            Whether you're camping, cooking for the family, or running a small
            restaurant, Mashesha has the right size.
          </p>

          {loading && (
            <p className="mt-14 text-charcoal/60">Loading cylinders…</p>
          )}

          {!loading && error && (
            <p className="mt-14 text-rust">
              Couldn't load products right now. Please try again shortly.
            </p>
          )}

          {!loading && !error && cylinders.length > 0 && (
            <div className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {cylinders.map((item: InventoryRow) => (
                <ProductPreviewCard key={item.inventory_id} item={item} />
              ))}
            </div>
          )}

          <Link
            to="/products"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
          >
            View all products →
          </Link>

          {/* Size guidance */}
          <div className="mt-16 rounded-2xl bg-rust p-10">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
