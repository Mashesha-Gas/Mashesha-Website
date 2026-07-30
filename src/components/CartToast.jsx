import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../hooks/useInventory";

const AUTO_HIDE_MS = 3500;

function CylinderPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-rust/50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13" r="3" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

export default function CartToast() {
  const { toast } = useCart();
  const [current, setCurrent] = useState(null);
  const [show, setShow] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (!toast) return;
    setCurrent(toast);
    // Mount off-screen first, then flip to the on-screen position next frame
    // so the transform transition actually has something to animate from.
    setShow(false);
    const frame = requestAnimationFrame(() => setShow(true));

    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), AUTO_HIDE_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hideTimer.current);
    };
  }, [toast]);

  if (!current) return null;

  const imageUrl = resolveImageUrl(current.thumbnailPath);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-24 right-4 z-[60] w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-charcoal/10 bg-white p-5 shadow-2xl transition-transform duration-300 ease-out ${
        show ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
      }`}
      onTransitionEnd={() => {
        if (!show) setCurrent(null);
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rust/10 bg-rust/5">
          {imageUrl ? (
            <img src={imageUrl} alt={current.size} className="h-full w-full object-contain p-1" />
          ) : (
            <CylinderPlaceholder />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust">Added to cart</p>
          <p className="mt-1 truncate font-display text-xl text-charcoal">{current.size}</p>
          <p className="mt-0.5 text-sm text-charcoal/60">
            Qty {current.qty} · R {(current.price * current.qty).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="Dismiss"
          className="flex-shrink-0 text-charcoal/30 transition-colors duration-200 hover:text-rust"
        >
          ✕
        </button>
      </div>
      <Link
        to="/cart"
        onClick={() => setShow(false)}
        className="mt-4 flex w-full items-center justify-center rounded-full bg-rust py-2.5 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
      >
        View cart
      </Link>
    </div>
  );
}
