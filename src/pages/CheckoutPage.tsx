import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, lineKey } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useDeliveryAreas } from "../hooks/useDeliveryAreas";
import { PROVINCES, COLLECTION_POINTS, DELIVERY_FEE, CHECKOUT_STASH_KEY } from "../constants";
import SEO from "../components/SEO";
import { PaymentOptionsCard } from "../components/PaymentBadges";
import { TradingHours } from "../components/CollectionOptions";

const API = import.meta.env.VITE_API_URL;

type Step = "details" | "processing";

type Fulfillment = "delivery" | "pickup";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  fulfillment: Fulfillment;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postcode: string;
  pickupLocation: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  fulfillment: "delivery",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  postcode: "",
  pickupLocation: "",
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
    fulfillment: "delivery",
    addressLine1: address?.address_line1 ?? "",
    addressLine2: [address?.address_unit, address?.address_line2].filter(Boolean).join(", "),
    city: address?.address_city ?? "",
    province: address?.address_province ?? "",
    postcode: address?.address_postcode != null ? String(address.address_postcode) : "",
    pickupLocation: "",
  };
}

// Never shown to the customer — only used when they place an order without
// opting into a visible account, so the Orders/Customers FK still has a real
// row to point at. They can claim the account later via "Forgot password?"
// on the login page to set a real one.
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
  const { items: cartItems } = useCart();
  const { activeAreas, loading: areasLoading } = useDeliveryAreas();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(() => buildInitialForm(user));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [accountConfirm, setAccountConfirm] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  // Coming back from a cancelled Yoco checkout — nothing was charged and
  // the cart is untouched, so the form just explains itself and waits.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cancelled")) {
      setSubmitError("Payment was cancelled. Your order was not placed and your cart is still here.");
      window.history.replaceState({}, "", "/checkout");
    }
  }, []);

  const selectedArea = activeAreas.find((a) => a.delivery_area_name === form.city);
  const freeShipping = form.fulfillment === "delivery" && !!selectedArea?.delivery_area_free_shipping;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deposits = cartItems.reduce((sum, item) => sum + (item.deposit || 0) * item.qty, 0);
  const deliveryFee = form.fulfillment === "delivery" && !freeShipping ? DELIVERY_FEE : 0;
  const total = subtotal + deposits + deliveryFee;

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
    if (!form.email.trim()) e.email = "Enter your email address.";
    else if (!form.email.includes("@")) e.email = "Enter a valid email address.";
    if (form.fulfillment === "delivery") {
      if (!form.addressLine1.trim()) e.addressLine1 = "Enter your street address.";
      if (!form.city.trim()) e.city = "Select your delivery area.";
      if (!form.province) e.province = "Select a province.";
      if (form.postcode.replace(/\D/g, "").length !== 4) e.postcode = "Enter a valid 4-digit postal code.";
    } else if (form.fulfillment === "pickup") {
      if (!form.pickupLocation) e.pickupLocation = "Select where you'd like to collect.";
    }
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

    const existsRes = await fetch(`${API}/api/customers/${encodeURIComponent(form.email)}/exists`);
    const { exists } = await existsRes.json().catch(() => ({ exists: false }));
    if (exists) return form.email;

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

  // Unlike the Paystack popup this replaces, paying means leaving the site
  // entirely for Yoco's own page — so everything that has to exist before
  // the order can be written happens here, up front, and the order itself
  // is written server-side by Yoco's webhook once the payment is confirmed.
  // Nothing here decides what gets charged either: the API re-prices the
  // cart and tells Yoco the amount, so the total shown below is only ever
  // a display of what the server independently works out.
  async function handlePlaceOrder(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError("");
    setStep("processing");

    try {
      const email = await resolveCustomerEmail();
      const addressId = form.fulfillment === "delivery" ? await createOrderAddress() : null;

      const vendorIds = Array.from(
        new Set(cartItems.map((item: any) => item.vendorId).filter((v: unknown) => v != null))
      );

      const checkout = await postJson("/api/payments/checkout", {
        items: cartItems.map((item) => ({ inventory_id: item.id, qty: item.qty, purchaseType: item.purchaseType })),
        fulfillment: form.fulfillment,
        order_customer_email: email,
        order_address_id: addressId,
        order_vendor_id: vendorIds.length === 1 ? vendorIds[0] : null,
        // Recorded only if the payment goes through, same as before.
        subscriber: whatsappConsent
          ? {
              subscriber_name: form.fullName,
              subscriber_whatsapp: form.phone,
              subscriber_suburb: form.fulfillment === "delivery" ? form.city : null,
              subscriber_consent: true,
              subscriber_consent_source: form.fulfillment === "delivery" ? "checkout_delivery" : "checkout_pickup",
            }
          : null,
      });

      // The receipt the customer comes back to is built from this — the
      // page is about to be torn down, and a guest has no way to read their
      // own order back out of the API afterwards.
      try {
        sessionStorage.setItem(CHECKOUT_STASH_KEY, JSON.stringify({
          reference: checkout.reference,
          items: cartItems,
          total: checkout.amount,
          fulfillment: form.fulfillment,
          freeShipping,
          pickupLocation: form.pickupLocation,
          fullName: form.fullName,
          phone: form.phone,
          address: {
            line1: form.addressLine1, line2: form.addressLine2,
            city: form.city, province: form.province, postcode: form.postcode,
          },
        }));
      } catch { /* a receipt is nice to have; never block payment over it */ }

      window.location.href = checkout.redirectUrl;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't start your payment. Please try again.");
      setStep("details");
    }
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
        <SEO title="Taking You to Payment… | Mashesha" description="Redirecting to secure payment." path="/checkout" noIndex />
        <div className="text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-full border-4 border-rust border-t-transparent animate-spin" />
          <p className="font-display text-2xl text-charcoal">Taking you to payment…</p>
          <p className="text-sm text-charcoal/50">You'll finish paying on Yoco's secure page, then come straight back.</p>
        </div>
      </main>
    );
  }

  // ── Address & contact details form ──────────────────────────────────────────
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <SEO title="Checkout | Mashesha" description="Complete your gas cylinder order details and delivery address." path="/checkout" noIndex />
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

            {/* Delivery / pickup */}
            <div className="space-y-5 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
              <p className={labelClass}>Delivery or collection</p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => update("fulfillment", "delivery")}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                    form.fulfillment === "delivery"
                      ? "border-rust bg-rust text-cream"
                      : "border-charcoal/15 text-charcoal/70 hover:border-rust/50"
                  }`}
                >
                  Deliver to me
                </button>
                <button
                  type="button"
                  onClick={() => update("fulfillment", "pickup")}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                    form.fulfillment === "pickup"
                      ? "border-rust bg-rust text-cream"
                      : "border-charcoal/15 text-charcoal/70 hover:border-rust/50"
                  }`}
                >
                  Collect in store
                </button>
              </div>

              {form.fulfillment === "delivery" ? (
                <>
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
                      <select
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className={inputClass("city")}
                      >
                        <option value="">
                          {areasLoading ? "Loading areas…" : "Select your area"}
                        </option>
                        {activeAreas.map((a) => (
                          <option key={a.delivery_area_id} value={a.delivery_area_name}>
                            {a.delivery_area_name}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="mt-1.5 text-xs text-red-500">{errors.city}</p>}
                      {freeShipping && (
                        <p className="mt-1.5 text-xs font-semibold text-rust">Free shipping to this area.</p>
                      )}
                      {!areasLoading && (
                        <button
                          type="button"
                          onClick={() => update("fulfillment", "pickup")}
                          className="mt-1.5 text-xs text-charcoal/50 hover:text-rust transition-colors duration-200"
                        >
                          Don't see your area? Collect in store instead.
                        </button>
                      )}
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
                </>
              ) : (
                <div>
                  <label className={labelClass}>Collect from</label>
                  <div className="space-y-2.5">
                    {COLLECTION_POINTS.map((point) => {
                      const selected = form.pickupLocation === point.id;
                      return (
                        <button
                          key={point.id}
                          type="button"
                          onClick={() => update("pickupLocation", point.id)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-200 ${
                            selected
                              ? "border-rust bg-rust text-cream"
                              : "border-charcoal/15 text-charcoal/70 hover:border-rust/50"
                          }`}
                        >
                          <span className="text-sm font-semibold">{point.name}</span>
                          <span className={`mt-0.5 block text-xs ${selected ? "text-cream/70" : "text-charcoal/45"}`}>{point.address}</span>
                          <TradingHours point={point} variant={selected ? "dark" : "light"} className="mt-1.5" />
                        </button>
                      );
                    })}
                  </div>
                  {errors.pickupLocation && <p className="mt-1.5 text-xs text-red-500">{errors.pickupLocation}</p>}
                  <p className="mt-3 text-sm text-charcoal/65">
                    We'll message you once your order is ready to collect. No delivery fee.
                  </p>
                </div>
              )}
            </div>

            <PaymentOptionsCard />

            <label className="flex items-start gap-3 rounded-xl border border-charcoal/10 bg-white p-4">
              <input
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-charcoal/30 text-rust focus:ring-rust"
              />
              <span className="text-xs text-charcoal/65 leading-relaxed">
                Yes, send me WhatsApp updates and offers from Mashesha. You can opt out at
                any time by replying "STOP" to any message, or by contacting us.
              </span>
            </label>

            {/* Place order button */}
            <button
              type="submit"
              disabled={step === "processing"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rust py-4 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-60"
            >
              <LockIcon />
              Pay R {total.toLocaleString()} with Yoco
            </button>

            <p className="text-center text-xs text-charcoal/40 flex items-center justify-center gap-1.5">
              <LockIcon />
              Secure payment powered by Yoco. You'll pay on Yoco's own page — your card details never touch our servers.
            </p>
            <p className="text-center text-xs text-charcoal/40">
              Prefer card on delivery or a payment link instead? Let us know via WhatsApp or phone after checking out.
            </p>
          </form>

          {/* Order summary — takes 2 of 5 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-7 sticky top-28">
              <h2 className="font-display text-xl text-charcoal">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                {cartItems.map((item) => (
                  <div key={lineKey(item.id, item.purchaseType)} className="flex justify-between text-charcoal/65">
                    <span>{item.size} × {item.qty}{item.purchaseType === "new" ? " (new)" : ""}</span>
                    <span>R {((item.price + (item.deposit || 0)) * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                {deposits > 0 && (
                  <div className="flex justify-between text-charcoal/65">
                    <span>Includes cylinder deposit</span>
                    <span>R {deposits.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/65">
                  <span>Delivery fee</span>
                  <span>
                    {form.fulfillment !== "delivery" ? "-" : freeShipping ? "Free" : `R ${DELIVERY_FEE}`}
                  </span>
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
