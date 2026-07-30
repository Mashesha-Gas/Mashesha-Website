import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_FEE = 50;

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

type Step = "details" | "processing" | "success";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postcode: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  postcode: "",
};

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { items: cartItems } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
    if (form.email.trim() && !form.email.includes("@")) e.email = "Enter a valid email address.";
    if (!form.addressLine1.trim()) e.addressLine1 = "Enter your street address.";
    if (!form.city.trim()) e.city = "Enter your city or suburb.";
    if (!form.province) e.province = "Select a province.";
    if (form.postcode.replace(/\D/g, "").length !== 4) e.postcode = "Enter a valid 4-digit postal code.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePlaceOrder(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStep("processing");
    // Simulate a short delay while the "order" is sent off
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
          <p className="font-display text-2xl text-charcoal">Placing your order…</p>
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
            Thanks, {form.fullName.split(" ")[0]}. We'll confirm your delivery by SMS or WhatsApp shortly.
          </p>

          {/* Delivery details */}
          <div className="rounded-2xl bg-rust p-5 text-left space-y-3">
            <div className="flex items-start gap-4">
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
            <div className="border-t border-cream/20 pt-3">
              <p className="text-sm font-semibold text-cream">Delivering to</p>
              <p className="mt-0.5 text-sm text-cream/80">
                {form.addressLine1}{form.addressLine2 ? `, ${form.addressLine2}` : ""}, {form.city}, {form.province} {form.postcode}
              </p>
              <p className="mt-1 text-sm text-cream/80">{form.phone}</p>
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
              <span>Total due on delivery</span>
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

  // ── Address & contact details form ──────────────────────────────────────────
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

          {/* Details form — takes 3 of 5 columns */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-3 space-y-8">

            {/* Contact details */}
            <div className="space-y-5">
              <p className={labelClass}>Contact details</p>
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text"
                  placeholder="e.g. Thandi Mokoena"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputClass("fullName")}
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    placeholder="082 123 4567"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass("phone")}
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email (optional)</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-5">
              <p className={labelClass}>Delivery address</p>
              <div>
                <label className={labelClass}>Street address</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Long Street"
                  value={form.addressLine1}
                  onChange={(e) => update("addressLine1", e.target.value)}
                  className={inputClass("addressLine1")}
                />
                {errors.addressLine1 && <p className="mt-1.5 text-xs text-red-500">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className={labelClass}>Unit / complex (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 4, Flat 2B"
                  value={form.addressLine2}
                  onChange={(e) => update("addressLine2", e.target.value)}
                  className={inputClass("addressLine2")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City / suburb</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandton"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass("city")}
                  />
                  {errors.city && <p className="mt-1.5 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>Postal code</label>
                  <input
                    type="text"
                    placeholder="2065"
                    inputMode="numeric"
                    value={form.postcode}
                    onChange={(e) => update("postcode", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className={inputClass("postcode")}
                  />
                  {errors.postcode && <p className="mt-1.5 text-xs text-red-500">{errors.postcode}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Province</label>
                <select
                  value={form.province}
                  onChange={(e) => update("province", e.target.value)}
                  className={inputClass("province")}
                >
                  <option value="">Select a province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.province && <p className="mt-1.5 text-xs text-red-500">{errors.province}</p>}
              </div>
            </div>

            {/* Place order button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rust py-4 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              <LockIcon />
              Place order — R {total.toLocaleString()}
            </button>

            <p className="text-center text-xs text-charcoal/40 flex items-center justify-center gap-1.5">
              <LockIcon />
              This is a demo checkout — payment is collected on delivery, nothing is charged now.
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
