import { useState } from "react";
import { Link } from "react-router-dom";
import { useInventoryList, resolveImageUrl, CYLINDER_TYPE } from "../hooks/useInventory";

interface InventoryRow {
  inventory_id: number;
  inventory_name: string;
  inventory_description: string | null;
  inventory_size: string | null;
  inventory_price: number | string | null;
  inventory_sale: number | string | null;
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

export default function ProductsPage() {
  const { items, loading, error } = useInventoryList();
  const cylinders = items.filter((item: InventoryRow) => item.inventory_type === CYLINDER_TYPE);

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
          <p className="text-charcoal/60">No cylinders in stock right now — check back soon.</p>
        )}

        {!loading && !error && cylinders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cylinders.map((item: InventoryRow) => {
              const label = item.inventory_size || item.inventory_name;
              return (
                <Link
                  key={item.inventory_id}
                  to={`/products/${item.inventory_id}`}
                  className="group flex flex-col rounded-2xl border border-charcoal/10 bg-white overflow-hidden transition-colors duration-200 hover:border-rust/50 hover:bg-rust/5"
                >
                  {/* Product image */}
                  <ProductImage src={resolveImageUrl(item.inventory_thumbnail_path)} label={label} />

                  {/* Card text */}
                  <div className="flex flex-col flex-1 p-6">
                    <span className="font-display text-4xl text-charcoal">{label}</span>
                    <span className="mt-2 text-sm font-semibold text-rust">{formatPrice(item)}</span>
                    <p className="mt-3 text-sm text-charcoal/65 leading-relaxed flex-1">
                      {item.inventory_description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal transition-colors duration-200 group-hover:text-rust">
                      View details
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
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
          </div>
        </div>
      </div>
    </main>
  );
}
