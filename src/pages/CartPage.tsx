import { Link } from "react-router-dom";
import { useCart, lineKey } from "../context/CartContext";
import SEO from "../components/SEO";
import { DELIVERY_FEE } from "../constants";

export default function CartPage() {
  const { items: cartItems, increment, decrement, removeItem } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deposits = cartItems.reduce((sum, item) => sum + (item.deposit || 0) * item.qty, 0);
  const total = subtotal + deposits + DELIVERY_FEE;
  const isEmpty = cartItems.length === 0;

  return (
    <main className="bg-rust min-h-screen pt-24 pb-20">
      <SEO title="Your Cart | Mashesha" description="Review your gas cylinder order before checkout." path="/cart" noIndex />
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Page header */}
        <div className="py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            Your order
          </span>
          <h1 className="font-display mt-4 text-5xl text-cream sm:text-6xl">
            Cart.
          </h1>
        </div>

        {isEmpty ? (
          <div className="rounded-2xl bg-cream p-16 text-center">
            <p className="text-charcoal/50 text-lg">Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              Browse cylinders
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const lineTotal = (item.price + (item.deposit || 0)) * item.qty;
                return (
                  <div
                    key={lineKey(item.id, item.purchaseType)}
                    className="flex items-center justify-between rounded-2xl bg-cream p-6"
                  >
                    <div>
                      <p className="font-display text-2xl text-charcoal">{item.size}</p>
                      {item.purchaseType === "new" ? (
                        <p className="mt-1 text-sm text-rust">
                          New cylinder{item.deposit > 0 ? ` · R ${item.deposit.toLocaleString()} deposit (refundable)` : ""}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-rust">{item.tagline || "Refill / exchange"}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => decrement(item.id, item.purchaseType)}
                          disabled={item.qty <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust text-sm disabled:opacity-30 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal/60"
                        >
                          −
                        </button>
                        <span className="text-charcoal text-sm w-4 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => increment(item.id, item.purchaseType)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-charcoal font-semibold w-20 text-right">
                        R {lineTotal.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.purchaseType)}
                        className="text-charcoal/25 hover:text-rust transition-colors duration-200 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="rounded-2xl bg-cream p-7 h-fit">
              <h2 className="font-display text-xl text-charcoal">Order summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                {cartItems.map((item) => (
                  <div key={lineKey(item.id, item.purchaseType)} className="flex justify-between text-charcoal/60">
                    <span>{item.size} × {item.qty}{item.purchaseType === "new" ? " (new)" : ""}</span>
                    <span>R {((item.price + (item.deposit || 0)) * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                {deposits > 0 && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Includes cylinder deposit</span>
                    <span>R {deposits.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/60">
                  <span>Delivery fee</span>
                  <span>R {DELIVERY_FEE}</span>
                </div>
                <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-charcoal">
                  <span>Total</span>
                  <span>R {total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-8 w-full inline-flex items-center justify-center rounded-full bg-rust px-5 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
              >
                Place order
              </Link>
              <Link
                to="/products"
                className="mt-3 w-full inline-flex items-center justify-center rounded-full border border-charcoal/15 px-5 py-3 text-sm font-semibold text-charcoal/70 transition-colors duration-200 hover:border-charcoal/40 hover:text-charcoal"
              >
                Add more items
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
