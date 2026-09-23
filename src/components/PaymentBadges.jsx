// Yoco doesn't have a checkout integration wired up yet — this is purely
// informational branding so customers know card-on-delivery and payment
// links are on the way / available on request. See CheckoutPage for the
// live payment flow, which still runs on Paystack.

function VisaMark({ className = "" }) {
  return (
    <span className={`inline-flex h-5 w-8 items-center justify-center rounded bg-white ${className}`}>
      <span className="font-display text-[10px] font-black italic tracking-tight text-[#1A1F71]">VISA</span>
    </span>
  );
}

function MastercardMark({ className = "" }) {
  return (
    <span className={`inline-flex h-5 w-8 items-center justify-center rounded bg-white ${className}`}>
      <span className="relative flex items-center">
        <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
        <span className="-ml-1.5 h-3 w-3 rounded-full bg-[#F79E1B] mix-blend-multiply" />
      </span>
    </span>
  );
}

export function CardNetworkIcons({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <VisaMark />
      <MastercardMark />
    </span>
  );
}

export function YocoMark({ className = "" }) {
  return (
    <span className={`inline-flex h-5 items-center rounded bg-white px-2 ${className}`}>
      <span className="font-display text-xs font-black tracking-tight text-[#5B21B6]">yoco</span>
    </span>
  );
}

// Compact "we accept" strip — footer, small print.
export function PaymentBadgeRow({ label = "Card payments powered by", className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-cream/50">{label}</span>}
      <YocoMark />
      <CardNetworkIcons />
    </div>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 9.5h19" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M11 6.5l1-1a3.5 3.5 0 015 5l-1 1" />
      <path d="M13 17.5l-1 1a3.5 3.5 0 01-5-5l1-1" />
    </svg>
  );
}

// Full explainer card — home page and checkout.
export function PaymentOptionsCard({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-cream/15 bg-ink-light p-6 sm:p-7 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-cream/50">How you can pay</p>
      <div className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rust/15 text-rust">
            <CardIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-cream">Card on delivery</p>
            <p className="mt-0.5 text-sm text-cream/60">
              Tap or insert your card when your driver arrives — no cash needed.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rust/15 text-rust">
            <LinkIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-cream">Payment link</p>
            <p className="mt-0.5 text-sm text-cream/60">
              We can send you a secure Yoco payment link to pay online before delivery.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 border-t border-cream/15 pt-4">
        <YocoMark />
        <CardNetworkIcons />
      </div>
    </div>
  );
}
