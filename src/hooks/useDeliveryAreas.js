import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

// Admin-managed list of towns/cities checkout will deliver to (mashesha-api
// /api/delivery-areas). Only the active ones are offered at checkout — a
// town not listed here isn't an error, it just means "collect in store"
// instead of delivery.
export function useDeliveryAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/api/delivery-areas`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => {
        if (!cancelled) setAreas(data);
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

  const activeAreas = areas.filter((a) => a.delivery_area_active);

  return { areas, activeAreas, loading, error };
}
