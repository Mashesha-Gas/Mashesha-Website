import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Jeppestown, Johannesburg — where Mashesha is based
const MASHESHA_COORDS = [-26.2041, 28.0617];
const ZOOM = 13;

// A custom rust-coloured teardrop pin that matches the site theme
const MASHESHA_PIN = L.divIcon({
  className: "",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -38],
  html: `
    <svg viewBox="0 0 28 36" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.6 14 22 14 22S28 23.6 28 14C28 6.268 21.732 0 14 0z" fill="#b14305"/>
      <circle cx="14" cy="14" r="6" fill="#ffffc5"/>
    </svg>
  `,
});

// A smaller dot for each delivery area — distinct from the HQ teardrop so
// the actual business location still stands out among them.
const AREA_PIN = L.divIcon({
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -8],
  html: `
    <svg viewBox="0 0 14 14" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" fill="#b14305" stroke="#ffffc5" stroke-width="2"/>
    </svg>
  `,
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// `areas` — delivery areas with delivery_area_lat/lng (see
// mashesha-terminal's Settings → Delivery Areas, which is where these
// coordinates get set). Areas without coordinates yet are just skipped.
export default function JohannesburgMap({ areas = [] }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const areaLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialise the map
    mapRef.current = L.map(containerRef.current, {
      center: MASHESHA_COORDS,
      zoom: ZOOM,
      scrollWheelZoom: false, // prevents accidental zoom while scrolling the page
    });

    // CartoDB Positron tiles — a clean, light style that suits the cream theme.
    // CARTO retired unauthenticated basemap tiles; get a free key (no account
    // needed) at https://carto.com/basemaps/apikey and set it as
    // VITE_CARTO_API_KEY in .env.
    L.tileLayer(
      `https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    // Drop the Mashesha pin and open its label immediately
    L.marker(MASHESHA_COORDS, { icon: MASHESHA_PIN })
      .addTo(mapRef.current)
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5;">
          <strong style="color:#b14305;">Mashesha Gas</strong><br/>
          Jeppestown, Johannesburg
        </div>`,
        { closeButton: false }
      )
      .openPopup();

    areaLayerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      // Clean up the map when the component is removed from the page
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Delivery areas load async (a separate API call from LocationsPage), so
  // this redraws pins whenever the list arrives/changes rather than only on
  // the map's own mount.
  useEffect(() => {
    if (!mapRef.current || !areaLayerRef.current) return;
    areaLayerRef.current.clearLayers();

    const withCoords = areas.filter(
      (a) => a.delivery_area_lat != null && a.delivery_area_lng != null
    );
    if (!withCoords.length) return;

    const bounds = L.latLngBounds([MASHESHA_COORDS]);
    withCoords.forEach((area) => {
      const coords = [area.delivery_area_lat, area.delivery_area_lng];
      bounds.extend(coords);
      L.marker(coords, { icon: AREA_PIN })
        .addTo(areaLayerRef.current)
        .bindPopup(
          `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5;">
            <strong style="color:#b14305;">${escapeHtml(area.delivery_area_name)}</strong>
            ${area.delivery_area_free_shipping ? '<br/><span style="color:#16a34a;">Free shipping</span>' : ""}
          </div>`
        );
    });

    mapRef.current.fitBounds(bounds, { padding: [32, 32], maxZoom: 12 });
  }, [areas]);

  return (
    <div
      ref={containerRef}
      // Leaflet's internal panes/controls/popups use z-index values up to
      // 1000, and the map container itself never gets an explicit z-index
      // (just position: relative, set by Leaflet's own JS) — so without
      // `relative z-0` here to give it its own stacking context, those
      // internal layers compare directly against the page's root stacking
      // context and render above the fixed mobile header (z-50) when its
      // menu is open.
      className="relative z-0 w-full rounded-2xl overflow-hidden border border-charcoal/10"
      style={{ height: "420px" }}
      aria-label="Map showing Mashesha Gas location in Jeppestown, Johannesburg"
    />
  );
}
