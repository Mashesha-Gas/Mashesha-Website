import { useState } from "react";
import { Link } from "react-router-dom";
import { useInventoryList, resolveImageUrl, CYLINDER_TYPE } from "../hooks/useInventory";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";
import { whatsAppLink } from "../utils/whatsapp";

interface InventoryRow {
  inventory_id: number;
  inventory_name: string;
  inventory_description: string | null;
  inventory_size: string | null;
  inventory_price: number | string | null;
  inventory_sale: number | string | null;
  inventory_deposit: number | string | null;
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

function ProductImage({ src, label }: { src: string | null; label: string }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white border border-rust/10">
      {showImage && (
        <img
          src={src}
          alt={`Mashesha ${label} gas cylinder`}
          className="w-full h-full object-contain p-4"
          onError={() => setFailed(true)}
        />
      )}
      {/* Placeholder only renders when there's no image or it failed to load */}
      {!showImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-rust/40">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <circle cx="12" cy="13" r="3" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          <span className="text-xs font-medium">{label} photo</span>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item }: { item: InventoryRow }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"refill" | "new">("refill");
  const label = item.inventory_size || item.inventory_name;
  const inStock = Number(item.inventory_quantity) > 0;
  const deposit = Number(item.inventory_deposit) || 0;
  const hasDeposit = deposit > 0;

  function handleAdd() {
    addItem(item, 1, { purchaseType: hasDeposit ? purchaseType : "refill" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const whatsAppMessage = `Hi Mashesha, I'd like to order: 1 x ${label} gas cylinder${
    hasDeposit ? ` (${purchaseType === "new" ? "new cylinder" : "refill/exchange"})` : ""
  }.`;

  return (
    // The clickable "view details" area is a <Link> (an <a>), so the actual
    // action buttons below live outside it — an <a> can't contain another
    // <a>/<button> without breaking the DOM (browsers silently un-nest it,
    // which breaks click targeting and layout both).
    <div className="group flex flex-col rounded-2xl border border-cream/15 bg-ink-light overflow-hidden transition-colors duration-200 hover:border-rust/50">
      <Link to={`/products/${item.inventory_id}`} className="flex flex-col flex-1">
        {/* Product image */}
        <ProductImage src={resolveImageUrl(item.inventory_thumbnail_path)} label={label} />

        {/* Card text */}
        <div className="flex flex-col flex-1 p-6 pb-0">
          <span className="font-display text-4xl text-cream">{label}</span>
          <span className="mt-2 text-sm font-semibold text-cream">
            {purchaseType === "new" && hasDeposit
              ? `R ${(Number(item.inventory_sale ?? item.inventory_price) + deposit).toLocaleString()}`
              : formatPrice(item)}
          </span>
          {hasDeposit && (
            <span className="mt-1 text-xs text-cream/45">
              {purchaseType === "new" ? `Includes R ${deposit.toLocaleString()} refundable deposit` : "Refill/exchange price — new cylinders include a refundable deposit"}
            </span>
          )}
          <p className="mt-3 text-sm text-cream/65 leading-relaxed flex-1">
            {item.inventory_description}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cream/80 transition-colors duration-200 group-hover:text-cream">
            View details
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>

      <div className="p-6 pt-4">
        {hasDeposit && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPurchaseType("refill")}
              className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                purchaseType === "refill" ? "border-rust bg-rust text-cream" : "border-cream/20 text-cream/60"
              }`}
            >
              Refill / exchange
            </button>
            <button
              type="button"
              onClick={() => setPurchaseType("new")}
              className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                purchaseType === "new" ? "border-rust bg-rust text-cream" : "border-cream/20 text-cream/60"
              }`}
            >
              New cylinder
            </button>
          </div>
        )}

        <div className={`flex items-center gap-2 ${hasDeposit ? "mt-3" : ""}`}>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            className="flex-1 rounded-full bg-rust px-4 py-2 text-xs font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-40 disabled:hover:bg-rust disabled:cursor-not-allowed"
          >
            {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
          </button>
          <a
            href={whatsAppLink(whatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-cream/30 px-4 py-2 text-center text-xs font-semibold text-cream transition-colors duration-200 hover:border-cream/60"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { items, loading, error } = useInventoryList();
  const cylinders = items.filter((item: InventoryRow) => item.inventory_type === CYLINDER_TYPE);

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <SEO
        title="Gas Cylinders for Sale | LPG for Cooking & Gas Heaters | Mashesha"
        description="Browse LPG gas cylinders for cooking, stoves and gas heaters. All sizes in stock, refilled to SANS safety standards, delivered across Johannesburg by Mashesha."
        path="/products"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 overflow-hidden">
        {/* Page header */}
        <div className="max-w-2xl py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Products
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Our gas cylinders.
          </h1>
          <p className="mt-5 text-lg text-charcoal/65">
            Browse our current cylinder stock, straight from the Mashesha inventory.
            Click any cylinder to learn more.
          </p>
        </div>

        {loading && (
          <p className="text-charcoal/60">Loading cylinders…</p>
        )}

        {!loading && error && (
          <p className="text-rust">
            Couldn't load products right now. Please try again shortly.
          </p>
        )}

        {!loading && !error && cylinders.length === 0 && (
          <p className="text-charcoal/60">No cylinders in stock right now. Check back soon.</p>
        )}

        {!loading && !error && cylinders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cylinders.map((item: InventoryRow) => (
              <ProductCard key={item.inventory_id} item={item} />
            ))}
          </div>
        )}

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
      </div>
    </main>
  );
}
