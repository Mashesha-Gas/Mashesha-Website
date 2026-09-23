import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import CylinderIcon from "../components/CylinderIcon";
import { useInventoryItem, useInventoryList, resolveImageUrl, CYLINDER_TYPE } from "../hooks/useInventory";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";
import { PaymentOptionsCard } from "../components/PaymentBadges";
import { CollectionOptionsCard } from "../components/CollectionOptions";
import { whatsAppLink } from "../utils/whatsapp";

function formatPrice(item) {
  const price = Number(item.inventory_price);
  const sale = item.inventory_sale != null ? Number(item.inventory_sale) : null;
  if (sale != null && sale < price) {
    return { current: `R ${sale.toLocaleString()}`, was: `R ${price.toLocaleString()}` };
  }
  return { current: `R ${price.toLocaleString()}`, was: null };
}

function InfoRow({ label, value }) {
  return (
    <li className="flex items-center justify-between border-b border-charcoal/10 py-3 last:border-0">
      <span className="text-sm text-charcoal/60">{label}</span>
      <span className="text-sm font-semibold text-charcoal">{value}</span>
    </li>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const { item: product, loading, error } = useInventoryItem(id);
  const { items: allItems } = useInventoryList();
  const { addItem } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [purchaseType, setPurchaseType] = useState("refill");

  if (loading) {
    return (
      <main className="bg-cream min-h-screen pt-24 pb-20 text-center text-charcoal/60">
        Loading cylinder…
      </main>
    );
  }

  if (error || !product) {
    return <Navigate to="/products" replace />;
  }

  const label = product.inventory_size || product.inventory_name;
  const price = formatPrice(product);
  const imageUrl = resolveImageUrl(product.inventory_thumbnail_path);
  const showImage = imageUrl && !imageFailed;
  const inStock = Number(product.inventory_quantity) > 0;

  const otherSizes = allItems.filter(
    (i) => i.inventory_type === CYLINDER_TYPE && i.inventory_id !== product.inventory_id
  );

  const deposit = Number(product.inventory_deposit) || 0;
  const hasDeposit = deposit > 0;

  function handleAddToCart() {
    addItem(product, qty, { purchaseType: hasDeposit ? purchaseType : "refill" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <SEO
        title={`${label} Gas Cylinder | LPG Refill | Mashesha`}
        description={`${label} LPG gas cylinder, SANS-certified and refilled for cooking or gas heaters. Order before noon for same-day delivery in our areas of operation.`}
        path={`/products/${id}`}
      />
      {/* Breadcrumb */}
      <div className="bg-cream pt-24 pb-0">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="flex items-center gap-2 text-sm text-charcoal/50" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors duration-200 hover:text-rust">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition-colors duration-200 hover:text-rust">Products</Link>
            <span>/</span>
            <span className="text-charcoal">{label} Cylinder</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-center">
            <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-2xl border border-rust/10 bg-white sm:h-64 sm:w-64">
              {showImage ? (
                <img
                  src={imageUrl}
                  alt={`Mashesha ${label} gas cylinder`}
                  className="h-full w-full object-contain p-6"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <CylinderIcon className="h-32 w-auto text-rust" />
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">
                {product.inventory_brand || "Gas Cylinder"}
              </span>
              <h1 className="font-display mt-3 text-6xl text-charcoal sm:text-7xl">{label}</h1>
              <p className="mt-2 text-xl font-semibold text-charcoal/60">
                {purchaseType === "new" && hasDeposit ? `R ${(Number(product.inventory_sale ?? product.inventory_price) + deposit).toLocaleString()}` : price.current}
                {price.was && purchaseType !== "new" && <span className="ml-2 text-base font-medium text-charcoal/40 line-through">{price.was}</span>}
              </p>
              {purchaseType === "new" && hasDeposit && (
                <p className="mt-1 text-sm text-charcoal/50">Includes R {deposit.toLocaleString()} refundable cylinder deposit</p>
              )}
              <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/65">{product.inventory_description}</p>

              {hasDeposit && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-rust mb-2">How would you like this?</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPurchaseType("refill")}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                        purchaseType === "refill" ? "border-rust bg-rust text-cream" : "border-charcoal/20 text-charcoal/60 hover:border-rust/50"
                      }`}
                    >
                      Refill / exchange
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurchaseType("new")}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                        purchaseType === "new" ? "border-rust bg-rust text-cream" : "border-charcoal/20 text-charcoal/60 hover:border-rust/50"
                      }`}
                    >
                      New cylinder
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-charcoal/50">
                    {purchaseType === "refill"
                      ? "You'll hand over an empty cylinder of the same size — no deposit."
                      : "You don't have a cylinder to exchange yet — a refundable deposit applies."}
                  </p>
                </div>
              )}

              {inStock && (
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust disabled:opacity-30 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal/60"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-charcoal">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust"
                  >
                    +
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-40 disabled:hover:bg-rust"
                >
                  {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
                </button>
                <a
                  href={whatsAppLink(
                    `Hi Mashesha, I'd like to order: ${qty} x ${label} gas cylinder${qty > 1 ? "s" : ""}${
                      hasDeposit ? ` (${purchaseType === "new" ? "new cylinder" : "refill/exchange"})` : ""
                    }.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-rust/30 px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:border-rust/60"
                >
                  Order on WhatsApp
                </a>
                {added ? (
                  <Link to="/cart" className="text-sm font-semibold text-rust transition-colors duration-200 hover:text-rust-dark">
                    View cart →
                  </Link>
                ) : (
                  <Link to="/products" className="text-sm font-semibold text-charcoal/60 transition-colors duration-200 hover:text-charcoal">
                    ← Back to all products
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details & help */}
      <section className="bg-rust/10 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust">Details</span>
              <h2 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl">Cylinder info.</h2>
              <ul className="mt-8">
                <InfoRow label="Size" value={label} />
                {product.inventory_brand && <InfoRow label="Brand" value={product.inventory_brand} />}
                <InfoRow label="Price" value={price.current} />
                {hasDeposit && <InfoRow label="New cylinder deposit" value={`R ${deposit.toLocaleString()} (refundable)`} />}
                <InfoRow label="Availability" value={inStock ? "In stock" : "Out of stock"} />
              </ul>
            </div>

            <div>
              {/* Help card */}
              <div className="rounded-2xl bg-rust p-7">
                <p className="text-sm font-semibold uppercase tracking-widest text-cream/70">Need help choosing?</p>
                <p className="mt-3 text-base text-cream/85">
                  Not sure if the {label} is right for you? Call us or send a WhatsApp.
                  We'll recommend the best size for your situation.
                </p>
                <a href="tel:+27111234567" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cream transition-colors duration-200 hover:text-cream/70">
                  Call us now →
                </a>
              </div>
            </div>
          </div>

          {/* Payment & collection options */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <PaymentOptionsCard />
            <CollectionOptionsCard />
          </div>
        </div>
      </section>

      {/* Browse other sizes */}
      {otherSizes.length > 0 && (
        <section className="bg-cream py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rust">Not quite right?</p>
            <h2 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl">Browse other sizes.</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {otherSizes.map((c) => {
                const cLabel = c.inventory_size || c.inventory_name;
                const cImage = resolveImageUrl(c.inventory_thumbnail_path);
                return (
                  <Link
                    key={c.inventory_id}
                    to={`/products/${c.inventory_id}`}
                    className="group flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-8 py-6 transition-colors duration-200 hover:border-rust/50 hover:bg-rust/5"
                  >
                    {cImage ? (
                      <img
                        src={cImage}
                        alt={`Mashesha ${cLabel} gas cylinder`}
                        className="h-24 w-auto object-contain transition-transform duration-200 group-hover:-translate-y-1"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <CylinderIcon className="h-24 w-auto text-rust transition-transform duration-200 group-hover:-translate-y-1" />
                    )}
                    <span className="font-display mt-4 text-xl text-charcoal">{cLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetailPage;
