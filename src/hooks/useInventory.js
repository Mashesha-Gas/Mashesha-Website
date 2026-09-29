import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

// Cylinders are the LPG-type rows in Inventory — other rows (regulators, etc.)
// use inventory_type "Accessory" and are excluded from the cylinders page.
export const CYLINDER_TYPE = "LPG";

export function useInventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/api/inventory`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => {
        if (!cancelled) setItems(data);
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
  }, []);

  return { items, loading, error };
}

export function useInventoryItem(id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${API}/api/inventory/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => {
        if (!cancelled) setItem(data);
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
  }, [id]);

  return { item, loading, error };
}

export function resolveImageUrl(path) {
  return path ? `${API}/uploads/${path}` : null;
}

// The one rule for whether a (refill) discount is on: sale prices come only
// from a live promotion on the terminal's Promotions page, which the API
// adds as inventory_promo_price. It only counts when it's above zero and
// below the normal price. Every price shown or charged on the site goes
// through this, so display and cart can't disagree.
export function activeSalePrice(item) {
  const price = Number(item.inventory_price);
  const promo = item.inventory_promo_price != null && item.inventory_promo_price !== "" ? Number(item.inventory_promo_price) : NaN;
  return promo > 0 && promo < price ? promo : null;
}

export function effectivePrice(item) {
  return activeSalePrice(item) ?? Number(item.inventory_price);
}

// The cylinder price (inventory_deposit) charged on top of the refill price
// for a new cylinder — lowered while a cylinder promotion from the
// terminal's Promotions page is live (the API adds that as
// inventory_cylinder_promo_price).
export function effectiveDeposit(item) {
  const deposit = Number(item.inventory_deposit) || 0;
  const promo = item.inventory_cylinder_promo_price != null ? Number(item.inventory_cylinder_promo_price) : NaN;
  return promo >= 0 && promo < deposit ? promo : deposit;
}

// Shows the sale price with the original struck through in text (via the
// "(was R ...)" suffix) whenever a sale is actually on.
export function formatPrice(item) {
  const price = Number(item.inventory_price);
  const sale = activeSalePrice(item);
  if (sale != null) {
    return `R ${sale.toLocaleString()} (was R ${price.toLocaleString()})`;
  }
  return `R ${price.toLocaleString()}`;
}
