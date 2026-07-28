import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_FEE = 50;

type Step = "payment" | "processing" | "success";

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

// Formats a raw card number string as "1234 5678 9012 3456"
function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

// Formats expiry as "MM / YY"
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("payment");
  const [method, setMethod] = useState<"card" | "eft">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { items: cartItems } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  function validate() {
    const e: Record<string, string> = {};
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number.";
      if (expiry.replace(/\s/g, "").replace("/", "").length < 4) e.expiry = "Enter a valid expiry date.";
      if (cvv.length < 3) e.cvv = "Enter your 3-digit CVV.";
      if (!name.trim()) e.name = "Enter the name on your card.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePay(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStep("processing");
    // Simulate a 2-second payment processing delay
    setTimeout(() => setStep("success"), 2000);
  }

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-rust bg-white ${
      errors[field] ? "border-red-400" : "border-charcoal/15"
    }`;

  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-rust mb-2";

  // ── Processing overlay ──────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <main className="bg-cream min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-full border-4 border-rust border-t-transparent animate-spin" />
          <p className="font-display text-2xl text-charcoal">Processing payment…</p>
          <p className="text-sm text-charcoal/50">Please don't close this page.</p>
        </div>
      </main>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <main className="bg-cream min-h-screen flex items-center justify-center pt-20 px-5 pb-12">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rust">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-cream" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-charcoal">Order placed!</h1>
          <p className="text-charcoal/65 leading-relaxed">
            Thanks for your order. We'll confirm your delivery by SMS or WhatsApp shortly.
          </p>

          {/* Delivery time estimate */}
          <div className="rounded-2xl bg-rust p-5 text-left flex items-start gap-4">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-cream mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-cream">Estimated delivery</p>
              <p className="mt-0.5 text-sm text-cream/80">
                Today between <span className="font-semibold text-cream">2 – 4 hours</span> from now.
                Orders placed after 3 pm are delivered the following morning.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-6 text-left space-y-3 text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-charcoal/65">
                <span>{item.size} × {item.qty}</span>
                <span>R {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-charcoal/65">
              <span>Delivery fee</span>
              <span>R {DELIVERY_FEE}</span>
            </div>
            <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-charcoal">
              <span>Total paid</span>
              <span>R {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              Back to home
            </Link>
            <Link to="/profile" className="text-sm text-charcoal/50 hover:text-rust transition-colors duration-200">
              View order history
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Payment form ────────────────────────────────────────────────────────────
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">

        {/* Header */}
        <div className="py-12 max-w-xl">
          <Link to="/cart" className="text-sm text-charcoal/50 hover:text-rust transition-colors duration-200">
            ← Back to cart
          </Link>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">Checkout.</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">

          {/* Payment form — takes 3 of 5 columns */}
          <form onSubmit={handlePay} className="lg:col-span-3 space-y-8">

            {/* Payment method toggle */}
            <div>
              <p className={labelClass}>Payment method</p>
              <div className="flex rounded-xl border border-charcoal/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    method === "card" ? "bg-rust text-cream" : "text-charcoal/50 hover:text-charcoal"
                  }`}
                >
                  Credit / Debit card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("eft")}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    method === "eft" ? "bg-rust text-cream" : "text-charcoal/50 hover:text-charcoal"
                  }`}
                >
                  EFT / Bank transfer
                </button>
              </div>
            </div>

            {/* Card fields */}
            {method === "card" && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Name on card</label>
                  <input
                    type="text"
                    placeholder="e.g. Thandi Mokoena"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className={labelClass}>Card number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    inputMode="numeric"
                    className={inputClass("cardNumber")}
                  />
                  {errors.cardNumber && <p className="mt-1.5 text-xs text-red-500">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      inputMode="numeric"
                      className={inputClass("expiry")}
                    />
                    {errors.expiry && <p className="mt-1.5 text-xs text-red-500">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      className={inputClass("cvv")}
                    />
                    {errors.cvv && <p className="mt-1.5 text-xs text-red-500">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* EFT instructions */}
            {method === "eft" && (
              <div className="rounded-2xl border border-charcoal/10 bg-white p-7 space-y-4">
                <p className="text-sm font-semibold text-charcoal">Bank transfer details</p>
                {[
                  { label: "Bank", value: "FNB" },
                  { label: "Account name", value: "Mashesha Gas (Pty) Ltd" },
                  { label: "Account number", value: "62 000 123 456" },
                  { label: "Branch code", value: "250 655" },
                  { label: "Reference", value: "Your phone number" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm border-t border-charcoal/8 pt-3">
                    <span className="text-charcoal/50">{row.label}</span>
                    <span className="font-medium text-charcoal">{row.value}</span>
                  </div>
                ))}
                <p className="text-xs text-charcoal/50 pt-2">
                  Send your proof of payment to <span className="text-rust">info@mashesha.co.za</span> and we'll confirm your delivery.
                </p>
              </div>
            )}

            {/* Pay button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rust py-4 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              <LockIcon />
              {method === "card" ? `Pay R ${total.toLocaleString()}` : "I've made the transfer"}
            </button>

            <p className="text-center text-xs text-charcoal/40 flex items-center justify-center gap-1.5">
              <LockIcon />
              This is a demo checkout — no real payment is processed.
            </p>
          </form>

          {/* Order summary — takes 2 of 5 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-7 sticky top-28">
              <h2 className="font-display text-xl text-charcoal">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-charcoal/65">
                    <span>{item.size} × {item.qty}</span>
                    <span>R {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-charcoal/65">
                  <span>Delivery fee</span>
                  <span>R {DELIVERY_FEE}</span>
                </div>
                <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-charcoal text-base">
                  <span>Total</span>
                  <span>R {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
