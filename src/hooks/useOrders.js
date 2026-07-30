import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

// Mirrors mashesha-terminal's Orders.tsx maps so status labels/colours stay
// consistent between the admin terminal and the customer-facing site.
export const ORDER_STATUS = {
  301: { label: "Confirmed", dot: "bg-rust animate-pulse", text: "text-rust" },
  302: { label: "Processing", dot: "bg-rust animate-pulse", text: "text-rust" },
  303: { label: "Shipped", dot: "bg-rust animate-pulse", text: "text-rust" },
  304: { label: "Delivered", dot: "bg-green-500", text: "text-green-600" },
  305: { label: "EFT Pending", dot: "bg-rust animate-pulse", text: "text-rust" },
  306: { label: "EFT Confirmed", dot: "bg-rust animate-pulse", text: "text-rust" },
  307: { label: "Completed", dot: "bg-green-500", text: "text-green-600" },
  308: { label: "Ready to Ship", dot: "bg-rust animate-pulse", text: "text-rust" },
  309: { label: "Cancelled", dot: "bg-charcoal/25", text: "text-charcoal/40" },
  310: { label: "Driver Collected", dot: "bg-rust animate-pulse", text: "text-rust" },
};

// Orders in one of these statuses are done — everything else is still "active".
const FINISHED_STATUSES = [304, 307, 309];

export function isActiveOrder(order) {
  return !FINISHED_STATUSES.includes(order.order_status);
}

export function useMyOrders(token) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`${API}/api/customers/me/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load orders"))))
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { orders, loading, error };
}
