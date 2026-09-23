import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, lineKey } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useDeliveryAreas } from "../hooks/useDeliveryAreas";
import { useInventoryList, resolveImageUrl, formatPrice, CYLINDER_TYPE } from "../hooks/useInventory";
import { COLLECTION_POINTS, DELIVERY_FEE } from "../constants";
import { YocoMark, CardNetworkIcons } from "./PaymentBadges";
import { TradingHours } from "./CollectionOptions";

const API = import.meta.env.VITE_API_URL;
const STEP_LABELS = ["Cylinder", "Where & how", "Details"];

// Never shown to the customer — this flow doesn't ask for an email at all,
// so a guest order still needs a real, unique row for the Orders FK to
// point at. Built from their phone number so it's stable if they order
// again later (same phone -> same synthetic "account", found via /exists).
function syntheticEmail(phone) {
  return `${phone.replace(/\D/g, "")}@guest.mashesha.co.za`;
}

function randomPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function postJson(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                active ? "bg-rust text-cream" : done ? "bg-rust/25 text-rust" : "bg-cream/10 text-cream/40"
              }`}
            >
              {done ? "✓" : n}
            </span>
            {n < STEP_LABELS.length && <span className="h-0.5 w-6 bg-cream/15" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

function QtyStepper({ qty, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={qty === 0}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream/30 text-xl font-bold text-cream transition-colors duration-200 disabled:opacity-30"
      >
        −
      </button>
      <span className="w-6 text-center text-lg font-bold text-cream">{qty}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-rust text-xl font-bold text-cream transition-colors duration-200 hover:bg-rust-dark"
      >
        +
      </button>
    </div>
  );
}

export default function QuickOrder() {
  const { user } = useAuth();
  const { items: cartItems, addItem, increment, decrement, removeItem, clearCart } = useCart();
  const { activeAreas, loading: areasLoading } = useDeliveryAreas();
  const { items: products, loading: productsLoading, error: productsError } = useInventoryList();
  const cylinders = products.filter((item) => item.inventory_type === CYLINDER_TYPE);

  const [step, setStep] = useState(1);
  const [fulfillment, setFulfillment] = useState("delivery");
  const [suburb, setSuburb] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.mobile ?? "");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // The quick-order flow only ever adds refills/exchanges — no deposit, no
  // "new cylinder" choice, to keep it to the promised three short steps.
  // That choice still lives on the product pages for anyone who wants it.
  const PURCHASE_TYPE = "refill";

  const cartQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price + (item.deposit || 0)) * item.qty, 0);
  const selectedArea = activeAreas.find((a) => a.delivery_area_name === suburb);
  const freeShipping = fulfillment === "delivery" && !!selectedArea?.delivery_area_free_shipping;
  const deliveryFee = fulfillment === "delivery" && !freeShipping ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  function qtyFor(id) {
    return cartItems.find((item) => item.id === id && item.purchaseType === PURCHASE_TYPE)?.qty ?? 0;
  }

  function increaseQty(product) {
    const existing = cartItems.find((item) => item.id === product.inventory_id && item.purchaseType === PURCHASE_TYPE);
    if (existing) increment(product.inventory_id, PURCHASE_TYPE);
    else addItem(product, 1, { purchaseType: PURCHASE_TYPE, silent: true });
  }

  function decreaseQty(id) {
    const existing = cartItems.find((item) => item.id === id && item.purchaseType === PURCHASE_TYPE);
    if (!existing) return;
    if (existing.qty <= 1) removeItem(id, PURCHASE_TYPE);
    else decrement(id, PURCHASE_TYPE);
  }

  function goNext() {
    if (step === 1 && cartQty === 0) {
      setErrors({ step1: "Choose at least one cylinder to continue." });
      return;
    }
    if (step === 2) {
      const e = {};
      if (fulfillment === "delivery" && !suburb) e.suburb = "Choose your suburb.";
      if (fulfillment === "collection" && !pickupLocation) e.pickupLocation = "Choose where you'd like to collect.";
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleConfirm() {
    const e = {};
    if (!fullName.trim()) e.fullName = "Enter your name.";
    if (phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
    if (fulfillment === "delivery" && !address.trim()) e.address = "Enter your address.";
    if (!paymentMethod) e.paymentMethod = "Choose how you'll pay.";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const email = user ? user.email : syntheticEmail(phone);

      if (!user) {
        const existsRes = await fetch(`${API}/api/customers/${encodeURIComponent(email)}/exists`);
        const { exists } = await existsRes.json().catch(() => ({ exists: false }));
        if (!exists) {
          await postJson("/api/customers", {
            customer_name: fullName,
            customer_email: email,
            customer_password: randomPassword(),
            customer_mobile: phone,
          });
        }
      }

      let addressId = null;
      if (fulfillment === "delivery") {
        const addrData = await postJson("/api/addresses", {
          address_line1: address,
          address_city: suburb,
        });
        addressId = addrData.address_id;
      }

      const vendorIds = Array.from(new Set(cartItems.map((item) => item.vendorId).filter((v) => v != null)));
      const now = new Date();

      const order = await postJson("/api/orders", {
        order_items_json: JSON.stringify(cartItems.map((item) => ({ inventory_id: item.id, qty: item.qty, purchaseType: item.purchaseType }))),
        order_total: total,
        order_date: now.toISOString().slice(0, 10),
        order_time: now.toTimeString().slice(0, 8),
        order_type: fulfillment === "delivery" ? 202 : 204,
        order_payment_type: paymentMethod,
        order_status: 301,
        order_vendor_id: vendorIds.length === 1 ? vendorIds[0] : null,
        order_customer_email: email,
        order_address_id: addressId,
        order_guid: crypto.randomUUID(),
      });

      if (whatsappConsent) {
        postJson("/api/subscribers", {
          subscriber_name: fullName,
          subscriber_whatsapp: phone,
          subscriber_suburb: fulfillment === "delivery" ? suburb : null,
          subscriber_consent: true,
          subscriber_consent_source: fulfillment === "delivery" ? "checkout_delivery" : "checkout_pickup",
        }).catch((err) => console.error("Failed to record WhatsApp opt-in", err));
      }

      setPlacedOrder({
        orderId: order.order_id,
        items: cartItems,
        total,
        fulfillment,
        suburb,
        pickupLocation,
        address,
        phone,
      });
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function orderAnother() {
    setPlacedOrder(null);
    setStep(1);
    setSuburb("");
    setPickupLocation("");
    setAddress("");
    setPaymentMethod("");
    setWhatsappConsent(false);
    setErrors({});
  }

  const bigLabel = "block text-lg font-bold text-cream mb-3";
  const bigInput =
    "w-full rounded-2xl border-2 border-charcoal/15 px-5 py-4 text-lg text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-rust bg-white";

  // ── Confirmation ─────────────────────────────────────────────────────────
  if (placedOrder) {
    const point = COLLECTION_POINTS.find((p) => p.id === placedOrder.pickupLocation);
    return (
      <div className="rounded-3xl border border-cream/15 bg-ink p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rust">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-cream" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display mt-5 text-3xl text-cream">Order placed!</h3>
        <p className="mt-3 text-cream/70">
          Order #{placedOrder.orderId}. We'll contact you on <span className="font-semibold text-cream">{placedOrder.phone}</span> to confirm.
        </p>
        <p className="mt-1 text-sm text-cream/50">Your order confirmation will be sent by WhatsApp or SMS.</p>

        <div className="mt-6 rounded-2xl bg-cream p-5 text-left text-sm">
          {placedOrder.fulfillment === "delivery" ? (
            <>
              <p className="font-semibold text-charcoal">Delivering to</p>
              <p className="mt-1 text-charcoal/70">{placedOrder.address}, {placedOrder.suburb}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-charcoal">Collecting from</p>
              <p className="mt-1 text-charcoal/70">{point?.name}</p>
              {point?.address && <p className="mt-0.5 text-xs text-charcoal/50">{point.address}</p>}
            </>
          )}
          <div className="mt-4 space-y-1 border-t border-charcoal/10 pt-4">
            {placedOrder.items.map((item) => (
              <div key={lineKey(item.id, item.purchaseType)} className="flex justify-between text-charcoal/65">
                <span>{item.size} × {item.qty}</span>
                <span>R {((item.price + (item.deposit || 0)) * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-bold text-charcoal">
              <span>Total</span>
              <span>R {placedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={orderAnother}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-rust px-8 py-4 text-lg font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cream/15 bg-ink p-5 sm:p-8">
      <StepDots step={step} />
      <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-cream/60">
        Step {step} of 3 — {STEP_LABELS[step - 1]}
      </p>

      {/* ── Step 1: cylinder + quantity ──────────────────────────────────── */}
      {step === 1 && (
        <div className="mt-6">
          <p className={bigLabel}>Choose your cylinder</p>

          {productsLoading && <p className="text-cream/60">Loading cylinders…</p>}
          {!productsLoading && productsError && (
            <p className="text-cream">Couldn't load cylinders right now. Please try again shortly.</p>
          )}

          {!productsLoading && !productsError && (
            <div className="space-y-3">
              {cylinders.map((item) => {
                const src = resolveImageUrl(item.inventory_thumbnail_path);
                const inStock = Number(item.inventory_quantity) > 0;
                const qty = qtyFor(item.inventory_id);
                return (
                  <div
                    key={item.inventory_id}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-4 ${qty > 0 ? "border-rust bg-rust/10" : "border-cream/15"}`}
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream/60">
                      {src ? (
                        <img src={src} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-rust/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="7" width="18" height="13" rx="2" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg text-cream">{item.inventory_size || item.inventory_name}</p>
                      <p className="text-sm font-semibold text-cream">{formatPrice(item)}</p>
                      {!inStock && <p className="text-xs text-cream/40">Out of stock</p>}
                    </div>
                    {inStock && (
                      <QtyStepper qty={qty} onIncrease={() => increaseQty(item)} onDecrease={() => decreaseQty(item.inventory_id)} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {errors.step1 && <p className="mt-3 text-sm text-red-600">{errors.step1}</p>}
        </div>
      )}

      {/* ── Step 2: where & how ──────────────────────────────────────────── */}
      {step === 2 && (
        <div className="mt-6 space-y-6">
          <div>
            <label className={bigLabel} htmlFor="quick-order-suburb">Where are you?</label>
            <select
              id="quick-order-suburb"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className={bigInput}
            >
              <option value="">{areasLoading ? "Loading suburbs…" : "Select your suburb"}</option>
              {activeAreas.map((a) => (
                <option key={a.delivery_area_id} value={a.delivery_area_name}>{a.delivery_area_name}</option>
              ))}
            </select>
            {errors.suburb && <p className="mt-1.5 text-sm text-red-600">{errors.suburb}</p>}
            <p className="mt-2 text-sm text-cream/50">
              Your suburb not listed here?{" "}
              <Link to="/contact" className="font-semibold text-cream hover:underline">Contact us</Link> to see if we can make a plan.
            </p>
          </div>

          <div>
            <p className={bigLabel}>Delivery or collection?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFulfillment("delivery")}
                className={`flex-1 rounded-2xl border-2 px-4 py-4 text-lg font-semibold transition-colors duration-200 ${
                  fulfillment === "delivery" ? "border-rust bg-rust text-cream" : "border-cream/20 text-cream/70"
                }`}
              >
                Deliver to me
              </button>
              <button
                type="button"
                onClick={() => setFulfillment("collection")}
                className={`flex-1 rounded-2xl border-2 px-4 py-4 text-lg font-semibold transition-colors duration-200 ${
                  fulfillment === "collection" ? "border-rust bg-rust text-cream" : "border-cream/20 text-cream/70"
                }`}
              >
                Collect in store
              </button>
            </div>
          </div>

          {fulfillment === "collection" && (
            <div className="space-y-2.5">
              {COLLECTION_POINTS.map((point) => {
                const selected = pickupLocation === point.id;
                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setPickupLocation(point.id)}
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-200 ${
                      selected ? "border-rust bg-rust text-cream" : "border-cream/20 text-cream/70"
                    }`}
                  >
                    <span className="text-base font-semibold">{point.name}</span>
                    <span className={`mt-0.5 block text-xs ${selected ? "text-cream/70" : "text-cream/45"}`}>{point.address}</span>
                    <TradingHours point={point} variant="dark" className="mt-1.5" />
                  </button>
                );
              })}
              {errors.pickupLocation && <p className="text-sm text-red-600">{errors.pickupLocation}</p>}
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: details + payment ────────────────────────────────────── */}
      {step === 3 && (
        <div className="mt-6 space-y-6">
          <div>
            <label className={bigLabel} htmlFor="quick-order-name">Your name</label>
            <input
              id="quick-order-name"
              type="text"
              placeholder="e.g. Thandi Mokoena"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={bigInput}
            />
            {errors.fullName && <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className={bigLabel} htmlFor="quick-order-phone">Phone number</label>
            <input
              id="quick-order-phone"
              type="tel"
              placeholder="082 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={bigInput}
            />
            {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {fulfillment === "delivery" ? (
            <div>
              <label className={bigLabel} htmlFor="quick-order-address">Address</label>
              <input
                id="quick-order-address"
                type="text"
                placeholder="e.g. 12 Long Street, Unit 4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={bigInput}
              />
              <p className="mt-1.5 text-sm text-cream/50">Delivering to {suburb}.</p>
              {errors.address && <p className="mt-1.5 text-sm text-red-600">{errors.address}</p>}
            </div>
          ) : (
            <div className="rounded-2xl bg-cream p-4 text-sm text-charcoal/70">
              {(() => {
                const point = COLLECTION_POINTS.find((p) => p.id === pickupLocation);
                return (
                  <>
                    Collecting from <span className="font-semibold text-charcoal">{point?.name}</span>.
                    {point?.address && <span className="block mt-1 text-xs text-charcoal/50">{point.address}</span>}
                  </>
                );
              })()}
            </div>
          )}

          <div>
            <p className={bigLabel}>How will you pay?</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card_on_delivery")}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-colors duration-200 ${
                  paymentMethod === "card_on_delivery" ? "border-rust bg-rust text-cream" : "border-cream/20"
                }`}
              >
                <span>
                  <span className="block text-lg font-semibold text-cream">
                    Card on delivery
                  </span>
                  <span className={`block text-sm ${paymentMethod === "card_on_delivery" ? "text-cream/80" : "text-cream/55"}`}>
                    Tap or insert your card when it arrives
                  </span>
                </span>
                <span className="flex flex-shrink-0 items-center gap-1.5">
                  <YocoMark />
                  <CardNetworkIcons />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("payment_link")}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-colors duration-200 ${
                  paymentMethod === "payment_link" ? "border-rust bg-rust text-cream" : "border-cream/20"
                }`}
              >
                <span>
                  <span className="block text-lg font-semibold text-cream">
                    Payment link
                  </span>
                  <span className={`block text-sm ${paymentMethod === "payment_link" ? "text-cream/80" : "text-cream/55"}`}>
                    We'll send a secure link to pay online
                  </span>
                </span>
                <YocoMark />
              </button>
            </div>
            {errors.paymentMethod && <p className="mt-1.5 text-sm text-red-600">{errors.paymentMethod}</p>}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border-2 border-cream/20 p-4">
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-cream/40 text-rust focus:ring-rust"
            />
            <span className="text-sm text-cream/70 leading-relaxed">
              Send me WhatsApp updates and offers from Mashesha. You can opt out any time.
            </span>
          </label>

          <div className="rounded-2xl bg-cream p-4 text-sm">
            <div className="flex justify-between text-charcoal/65">
              <span>Subtotal</span>
              <span>R {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal/65">
              <span>Delivery fee</span>
              <span>{fulfillment !== "delivery" ? "-" : freeShipping ? "Free" : `R ${DELIVERY_FEE}`}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-charcoal/10 pt-2 text-base font-bold text-charcoal">
              <span>Total</span>
              <span>R {total.toLocaleString()}</span>
            </div>
          </div>

          {submitError && (
            <p className="rounded-xl border border-rust/40 bg-rust/15 px-4 py-3 text-sm text-cream">{submitError}</p>
          )}
        </div>
      )}

      {/* ── Nav buttons ───────────────────────────────────────────────────── */}
      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border-2 border-cream/20 px-6 py-4 text-lg font-semibold text-cream/70"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-full bg-rust py-4 text-lg font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 rounded-full bg-rust py-4 text-lg font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-50"
          >
            {submitting ? "Placing order…" : `Confirm order — R ${total.toLocaleString()}`}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-cream/40">No account or email needed to order.</p>
    </div>
  );
}
