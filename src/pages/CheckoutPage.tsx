import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PROVINCES } from "../constants";

const API = import.meta.env.VITE_API_URL;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const DELIVERY_FEE = 50;

type Step = "details" | "processing" | "success";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
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
  company: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  postcode: "",
};

// Prefills the form from the logged-in customer's saved details (if any) —
// a guest checking out with no session just gets the blank form.
function buildInitialForm(user: any): FormState {
  if (!user) return EMPTY_FORM;
  const address = user.address;
  return {
    fullName: user.name ?? "",
    phone: user.mobile ?? "",
    email: user.email ?? "",
    company: user.company ?? "",
    addressLine1: address?.address_line1 ?? "",
    addressLine2: [address?.address_unit, address?.address_line2].filter(Boolean).join(", "),
    city: address?.address_city ?? "",
    province: address?.address_province ?? "",
    postcode: address?.address_postcode != null ? String(address.address_postcode) : "",
  };
}

// Never shown to the customer — only used when they place an order without
// opting into a visible account, so the Orders/Customers FK still has a real
// row to point at. They'd need a password-reset flow (not built yet) to ever
// log into it.
function randomPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { user, establishSession } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(() => buildInitialForm(user));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [accountConfirm, setAccountConfirm] = useState("");
  const [placedOrder, setPlacedOrder] = useState<{ items: typeof cartItems; total: number; orderId: number } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
    if (!form.email.trim()) e.email = "Enter your email address.";
    else if (!form.email.includes("@")) e.email = "Enter a valid email address.";
    if (!form.addressLine1.trim()) e.addressLine1 = "Enter your street address.";
    if (!form.city.trim()) e.city = "Enter your city or suburb.";
    if (!form.province) e.province = "Select a province.";
    if (form.postcode.replace(/\D/g, "").length !== 4) e.postcode = "Enter a valid 4-digit postal code.";
    if (!user && createAccount) {
      if (accountPassword.length < 8) e.accountPassword = "Password must be at least 8 characters.";
      if (accountPassword !== accountConfirm) e.accountConfirm = "Passwords don't match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Every order needs a real Customers row behind it (Orders.order_customer_email
  // is a FK). Logged-in customers already have one; guests get one created here —
  // with the password they chose if they ticked "create an account", or a random
  // one they'll never see otherwise. An email that's already registered is left
  // alone and just reused for this order.
  async function resolveCustomerEmail(): Promise<string> {
    if (user) return user.email;

    const existsRes = await fetch(`${API}/api/customers/${encodeURIComponent(form.email)}`);
    if (existsRes.ok) return form.email;

    const password = createAccount && accountPassword ? accountPassword : randomPassword();
    const data = await postJson("/api/customers", {
      customer_name: form.fullName,
      customer_email: form.email,
      customer_password: password,
      customer_mobile: form.phone,
      customer_company: form.company || null,
    });

    if (createAccount) {
      await establishSession(data.token);
    }

    return form.email;
  }

  async function createOrderAddress(): Promise<number> {
    const data = await postJson("/api/addresses", {
      address_line1: form.addressLine1,
      address_unit: form.addressLine2 || null,
      address_city: form.city,
      address_postcode: form.postcode,
      address_province: form.province,
    });
    return data.address_id;
  }

  // Runs after Paystack's popup calls back with a reference — re-verifies it
  // server-side (the popup's own "success" callback is never trusted alone),
  // cross-checks the paid amount against this order's total, then creates
  // the order with that reference recorded in order_guid.
  async function finalizeOrder(reference: string) {
    setStep("processing");
    try {
      const verifyRes = await fetch(`${API}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error("We couldn't confirm your payment with Paystack. You have not been charged — please try again.");
      }
      if (verifyData.currency !== "ZAR" || Math.abs(verifyData.amount - total) > 0.5) {
        throw new Error("The confirmed payment amount didn't match your order. Please contact us before trying again.");
      }

      const email = await resolveCustomerEmail();
      const addressId = await createOrderAddress();

      const vendorIds = Array.from(
        new Set(cartItems.map((item: any) => item.vendorId).filter((v: unknown) => v != null))
      );
      const now = new Date();

      const order = await postJson("/api/orders", {
        order_items_json: JSON.stringify(cartItems.map((item) => ({ inventory_id: item.id, qty: item.qty }))),
        order_total: total,
        order_date: now.toISOString().slice(0, 10),
        order_time: now.toTimeString().slice(0, 8),
        order_type: 202,
        order_payment_type: "card",
        order_status: 301,
        order_vendor_id: vendorIds.length === 1 ? vendorIds[0] : null,
        order_customer_email: email,
        order_address_id: addressId,
        order_guid: reference,
      });

      setPlacedOrder({ items: cartItems, total, orderId: order.order_id });
      clearCart();
      setStep("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't place your order. Please try again.");
      setStep("details");
    }
  }

  function handlePlaceOrder(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError("");

    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      setSubmitError("Payments are still loading — please try again in a moment.");
      return;
    }

    const handler = paystack.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: Math.round(total * 100),
      currency: "ZAR",
      ref: crypto.randomUUID(),
      callback: (response: { reference: string }) => {
        finalizeOrder(response.reference);
      },
      onClose: () => {
        setSubmitError("Payment was cancelled — your order was not placed.");
      },
    });
    handler.openIframe();
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
  if (step === "success" && placedOrder) {
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
            Thanks, {form.fullName.split(" ")[0]}. Order #{placedOrder.orderId} — we'll confirm your delivery by SMS or WhatsApp shortly.
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
            {placedOrder.items.map((item) => (
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
              <span>R {placedOrder.total.toLocaleString()}</span>
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

            {submitError && (
              <p className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">{submitError}</p>
            )}

            {/* Contact details */}
            <div className="space-y-5 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
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
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    disabled={!!user}
                    onChange={(e) => update("email", e.target.value)}
                    className={`${inputClass("email")} ${user ? "opacity-60" : ""}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Company (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jane's Spaza"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={inputClass("company")}
                />
              </div>

              {/* Guests get the option to save these details for next time */}
              {!user && (
                <div className="rounded-xl border border-charcoal/10 bg-cream/60 p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="h-4 w-4 rounded border-charcoal/30 text-rust focus:ring-rust"
                    />
                    Create an account to track this order
                  </label>
                  {createAccount && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={accountPassword}
                          onChange={(e) => setAccountPassword(e.target.value)}
                          className={inputClass("accountPassword")}
                        />
                        {errors.accountPassword && <p className="mt-1.5 text-xs text-red-500">{errors.accountPassword}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Confirm password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={accountConfirm}
                          onChange={(e) => setAccountConfirm(e.target.value)}
                          className={inputClass("accountConfirm")}
                        />
                        {errors.accountConfirm && <p className="mt-1.5 text-xs text-red-500">{errors.accountConfirm}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery address */}
            <div className="space-y-5 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
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
              Pay R {total.toLocaleString()} with Paystack
            </button>

            <p className="text-center text-xs text-charcoal/40 flex items-center justify-center gap-1.5">
              <LockIcon />
              Secure payment powered by Paystack — your card details never touch our servers.
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
