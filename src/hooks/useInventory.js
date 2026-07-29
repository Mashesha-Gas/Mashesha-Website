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
