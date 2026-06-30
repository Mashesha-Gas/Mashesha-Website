import { Link } from "react-router-dom";

const cartItems = [
  { id: 1, size: "12kg", tagline: "Everyday household cooking", price: 350, qty: 1 },
  { id: 2, size: "3kg", tagline: "Small household & backup", price: 120, qty: 2 },
];

const DELIVERY_FEE = 50;

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_FEE;
  const isEmpty = cartItems.length === 0;

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Page header */}
        <div className="py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Your order
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Cart.
          </h1>
        </div>

        {isEmpty ? (
          <div className="rounded-2xl border border-charcoal/10 bg-white p-16 text-center">
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-white p-6"
                >
                  <div>
                    <p className="font-display text-2xl text-charcoal">{item.size}</p>
                    <p className="mt-1 text-sm text-rust">{item.tagline}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <button className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust text-sm">
                        −
                      </button>
                      <span className="text-charcoal text-sm w-4 text-center">{item.qty}</span>
                      <button className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/60 hover:border-rust hover:text-rust text-sm">
                        +
                      </button>
                    </div>
                    <span className="text-charcoal font-semibold w-20 text-right">
                      R {(item.price * item.qty).toLocaleString()}
                    </span>
                    <button className="text-charcoal/25 hover:text-rust transition-colors duration-200 text-sm">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-charcoal/10 bg-white p-7 h-fit">
              <h2 className="font-display text-xl text-charcoal">Order summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-charcoal/60">
                    <span>{item.size} × {item.qty}</span>
                    <span>R {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
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
                to="/contact"
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
