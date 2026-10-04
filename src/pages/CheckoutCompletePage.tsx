import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart, lineKey } from "../context/CartContext";
import { COLLECTION_POINTS, DELIVERY_FEE, CHECKOUT_STASH_KEY } from "../constants";
import SEO from "../components/SEO";
import { TradingHours } from "../components/CollectionOptions";

const API = import.meta.env.VITE_API_URL;

// Where Yoco sends the customer back to. Landing here proves nothing on its
// own — Yoco's own guidance is that the redirect isn't confirmation, and a
// customer can reach this URL by typing it. What actually settles it is the
// payment.succeeded webhook Yoco sends our API, which is what writes the
// order; this page just polls until that's happened.
type Phase = "checking" | "paid" | "failed" | "timeout" | "missing";

// Webhooks are usually near-instant but aren't guaranteed to be, so this
// keeps asking for a bit before admitting it doesn't know yet.
const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 45000;

type Stash = {
  reference: string;
  items: any[];
  total: number;
  fulfillment: "delivery" | "pickup";
  freeShipping: boolean;
  pickupLocation: string;
  fullName: string;
  phone: string;
  address: { line1: string; line2: string; city: string; province: string; postcode: string };
};

function readStash(reference: string | null): Stash | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STASH_KEY);
    if (!raw) return null;
    const stash = JSON.parse(raw) as Stash;
    return !reference || stash.reference === reference ? stash : null;
  } catch {
    return null;
  }
}

export default function CheckoutCompletePage() {
  const [params] = useSearchParams();
  const reference = params.get("ref");
  const declaredFailed = params.get("failed") === "1";
  const { clearCart } = useCart();

  const [phase, setPhase] = useState<Phase>(reference ? "checking" : "missing");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [stash] = useState<Stash | null>(() => readStash(reference));

  // The cart is only emptied once the payment is actually confirmed — a
  // cancelled or failed attempt has to leave it exactly as it was, or the
  // customer loses their basket over a declined card.
  const cleared = useRef(false);

  useEffect(() => {
    if (!reference) return;
    let active = true;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await fetch(`${API}/api/payments/checkout/${encodeURIComponent(reference!)}`);
        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          if (data.paid) {
            setOrderId(data.order_id);
            setPhase("paid");
            if (!cleared.current) { cleared.current = true; clearCart(); }
            try { sessionStorage.removeItem(CHECKOUT_STASH_KEY); } catch { /* best effort */ }
            return;
          }
          if (data.status === "failed" || data.status === "mismatch") { setPhase("failed"); return; }
        } else if (res.status === 404) {
          setPhase("missing");
          return;
        }
      } catch { /* offline or a blip — the retry below covers it */ }

      if (!active) return;
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) { setPhase("timeout"); return; }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => { active = false; };
  }, [reference, clearCart]);

  const shell = (children: React.ReactNode) => (
    <main className="bg-cream min-h-screen flex items-center justify-center pt-20 px-5 pb-12">
      <SEO title="Order Status | Mashesha" description="Your gas cylinder order status." path="/checkout/complete" noIndex />
      <div className="w-full max-w-md text-center space-y-5">{children}</div>
    </main>
  );

  if (phase === "checking" && !declaredFailed) {
    return shell(
      <>
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-rust border-t-transparent animate-spin" />
        <p className="font-display text-2xl text-charcoal">Confirming your payment…</p>
        <p className="text-sm text-charcoal/50">This usually takes a few seconds. Please don't close this page.</p>
      </>
    );
  }

  if (phase === "failed" || declaredFailed) {
    return shell(
      <>
        <h1 className="font-display text-4xl text-charcoal">Payment not completed</h1>
        <p className="text-charcoal/65 leading-relaxed">
          Your payment didn't go through, so no order was placed and you haven't been charged.
          Your cart is still saved.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link to="/checkout" className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
            Try again
          </Link>
          <Link to="/contact" className="text-sm text-charcoal/50 hover:text-rust transition-colors duration-200">
            Contact us for help
          </Link>
        </div>
      </>
    );
  }

  if (phase === "timeout") {
    return shell(
      <>
        <h1 className="font-display text-4xl text-charcoal">Still confirming</h1>
        <p className="text-charcoal/65 leading-relaxed">
          Your payment is taking longer than usual to confirm. If it went through, your order is safe and
          you'll get a confirmation email shortly — please don't pay again. Get in touch if you don't hear
          from us.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
            Contact us
          </Link>
          <Link to="/" className="text-sm text-charcoal/50 hover:text-rust transition-colors duration-200">Back to home</Link>
        </div>
      </>
    );
  }

  if (phase === "missing") {
    return shell(
      <>
        <h1 className="font-display text-4xl text-charcoal">Nothing to show here</h1>
        <p className="text-charcoal/65 leading-relaxed">
          We couldn't find a payment to confirm. If you've just paid, check your email for confirmation.
        </p>
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
          Back to home
        </Link>
      </>
    );
  }

  // ── Paid ──────────────────────────────────────────────────────────────────
  const firstName = stash?.fullName?.split(" ")[0];
  const point = stash ? COLLECTION_POINTS.find((p) => p.id === stash.pickupLocation) : null;

  return shell(
    <>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rust">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-cream" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display text-4xl text-charcoal">Order placed!</h1>
      <p className="text-charcoal/65 leading-relaxed">
        {firstName ? `Thanks, ${firstName}. ` : "Thanks. "}
        {orderId ? `Order #${orderId}. ` : ""}
        We'll confirm your delivery by SMS or WhatsApp shortly.
      </p>

      {/* The receipt below comes from what was stashed before paying. Coming
          back on another device or after clearing the tab loses it, so the
          confirmation above has to stand on its own without it. */}
      {stash && (stash.fulfillment === "delivery" ? (
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
                Orders placed after noon are delivered the following morning.
              </p>
            </div>
          </div>
          <div className="border-t border-cream/20 pt-3">
            <p className="text-sm font-semibold text-cream">Delivering to</p>
            <p className="mt-0.5 text-sm text-cream/80">
              {stash.address.line1}{stash.address.line2 ? `, ${stash.address.line2}` : ""}, {stash.address.city}, {stash.address.province} {stash.address.postcode}
            </p>
            <p className="mt-1 text-sm text-cream/80">{stash.phone}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-rust p-5 text-left space-y-3">
          <div className="flex items-start gap-4">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-cream mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-cream">Ready for collection</p>
              <p className="mt-0.5 text-sm text-cream/80">
                Today within <span className="font-semibold text-cream">2 hours</span>. We'll message you when it's ready.
              </p>
            </div>
          </div>
          <div className="border-t border-cream/20 pt-3">
            <p className="text-sm font-semibold text-cream">Collect from</p>
            {point ? (
              <>
                <p className="mt-0.5 text-sm text-cream/80">{point.name}</p>
                <p className="mt-0.5 text-xs text-cream/60">{point.address}</p>
                <TradingHours point={point} variant="dark" className="mt-1.5" />
              </>
            ) : (
              <p className="mt-0.5 text-sm text-cream/80">Store to be confirmed</p>
            )}
            <p className="mt-2 text-xs text-cream/60">We'll message you on {stash.phone} when it's ready to collect.</p>
          </div>
        </div>
      ))}

      {stash && (
        <div className="rounded-2xl border border-charcoal/10 bg-white p-6 text-left space-y-3 text-sm">
          {stash.items.map((item) => (
            <div key={lineKey(item.id, item.purchaseType)} className="flex justify-between text-charcoal/65">
              <span>{item.size} × {item.qty}{item.purchaseType === "new" ? " (new)" : ""}</span>
              <span>R {((item.price + (item.deposit || 0)) * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-charcoal/65">
            <span>Delivery fee</span>
            <span>{stash.fulfillment !== "delivery" ? "-" : stash.freeShipping ? "Free" : `R ${DELIVERY_FEE}`}</span>
          </div>
          <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-charcoal">
            <span>Total paid</span>
            <span>R {stash.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
          Back to home
        </Link>
        <Link to="/profile" className="text-sm text-charcoal/50 hover:text-rust transition-colors duration-200">
          View order history
        </Link>
      </div>
    </>
  );
}
