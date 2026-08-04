import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Jeppestown, Johannesburg — where Mashesha is based
const MASHESHA_COORDS = [-26.2041, 28.0617];
const ZOOM = 13;
const DELIVERY_RADIUS_METERS = 30000; // 30 km delivery range

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

export default function JohannesburgMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialise the map
    mapRef.current = L.map(containerRef.current, {
      center: MASHESHA_COORDS,
      zoom: ZOOM,
      scrollWheelZoom: false, // prevents accidental zoom while scrolling the page
    });

    // CartoDB Positron tiles — a clean, light style that suits the cream theme
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    // Shade the 30 km delivery range around the Mashesha location
    const deliveryCircle = L.circle(MASHESHA_COORDS, {
      radius: DELIVERY_RADIUS_METERS,
      color: "#b14305",
      weight: 2,
      fillColor: "#b14305",
      fillOpacity: 0.08,
    }).addTo(mapRef.current);

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

    // Fit the view to the full 30 km range so the whole circle is visible
    mapRef.current.fitBounds(deliveryCircle.getBounds());

    return () => {
      // Clean up the map when the component is removed from the page
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-charcoal/10"
      style={{ height: "420px" }}
      aria-label="Map showing Mashesha Gas location in Jeppestown, Johannesburg"
    />
  );
}
