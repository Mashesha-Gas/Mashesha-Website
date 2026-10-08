import { useEffect, useState } from "react";
import { COLLECTION_POINTS } from "../constants";

const API = import.meta.env.VITE_API_URL;

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "08:00" → "8 am", "16:45" → "4:45 pm", "12:00" → "12 pm".
function friendlyTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
}

// Seven days (Monday first, null = closed) → the grouped rows the site
// shows: consecutive days with the same hours share a row, e.g.
// "Mon – Fri  8 am – 4:45 pm".
export function groupHours(week) {
  const rows = [];
  let i = 0;
  while (i < 7) {
    let j = i;
    const same = (a, b) => (a == null && b == null) || (a && b && a.open === b.open && a.close === b.close);
    while (j + 1 < 7 && same(week[j + 1], week[i])) j++;
    const label = i === j ? DAY_LONG[i] : `${DAY_SHORT[i]} – ${DAY_SHORT[j]}`;
    const time = week[i] ? `${friendlyTime(week[i].open)} – ${friendlyTime(week[i].close)}` : "Closed";
    rows.push({ label, time });
    i = j + 1;
  }
  return rows;
}

const fromApi = (l) => ({
  id: l.location_key,
  name: l.location_name,
  address: l.location_address ?? "",
  hours: groupHours(l.location_hours),
  note: l.location_hours_note ?? null,
});

// Shared across every component on the page, so the stores are fetched
// once per visit.
let cache = null;
let pending = null;

// The stores customers can collect from, with their trading hours — kept
// up to date by each vendor from the terminal (Retail management →
// Trading hours). Starts from the built-in list in constants.js so nothing
// flashes empty, and stays on it if the API can't be reached.
export function useCollectionPoints() {
  const [points, setPoints] = useState(cache ?? COLLECTION_POINTS);

  useEffect(() => {
    if (cache) return;
    pending ??= fetch(`${API}/api/store-locations`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((rows) => {
        if (rows.length) cache = rows.map(fromApi);
        return cache;
      })
      .catch(() => null);
    let cancelled = false;
    pending.then((p) => { if (p && !cancelled) setPoints(p); });
    return () => { cancelled = true; };
  }, []);

  return points;
}
