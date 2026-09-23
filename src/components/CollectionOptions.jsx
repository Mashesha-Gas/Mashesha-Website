import { COLLECTION_POINTS } from "../constants";

// Street addresses aren't published on the site yet — those get confirmed
// after checkout. Trading hours are shown since customers need them to plan
// a collection.

export function TradingHours({ point, variant = "light", className = "" }) {
  const dtClass = variant === "dark" ? "text-cream/70" : "text-charcoal/55";
  const ddClass = variant === "dark" ? "font-medium text-cream" : "font-medium text-charcoal/80";
  return (
    <dl className={`space-y-1 text-sm ${className}`}>
      {point.hours.map((row) => (
        <div key={row.label} className="flex justify-between gap-4">
          <dt className={dtClass}>{row.label}</dt>
          <dd className={ddClass}>{row.time}</dd>
        </div>
      ))}
    </dl>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10v9a1 1 0 001 1h14a1 1 0 001-1v-9" />
      <path d="M3 10l1.3-5.5A1 1 0 015.27 3.7h13.46a1 1 0 01.97.8L21 10" />
      <path d="M3 10a2.3 2.3 0 004.5.7A2.3 2.3 0 0012 10a2.3 2.3 0 004.5.7A2.3 2.3 0 0021 10" />
      <path d="M10 20v-4.5a1 1 0 011-1h2a1 1 0 011 1V20" />
    </svg>
  );
}

// Full explainer card — home page.
export function CollectionOptionsCard({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-rust">Collect in store</p>
      <p className="mt-3 text-sm text-charcoal/60">
        Skip delivery and pick up your order instead — choose whichever location suits you.
        We'll confirm the address and collection time when we get in touch about your order.
      </p>
      <div className="mt-4 space-y-5">
        {COLLECTION_POINTS.map((point) => (
          <div key={point.id} className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rust/10 text-rust">
              <StoreIcon />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-charcoal">{point.name}</p>
              <TradingHours point={point} className="mt-1.5" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-charcoal/40">Hours may vary on public holidays.</p>
    </div>
  );
}

// Compact "we've also got collection" line — footer.
export function CollectionBadgeLine({ className = "" }) {
  return (
    <p className={`text-sm text-cream/80 ${className}`}>
      Or collect in store: {COLLECTION_POINTS.map((p) => p.name).join(" · ")}
    </p>
  );
}
