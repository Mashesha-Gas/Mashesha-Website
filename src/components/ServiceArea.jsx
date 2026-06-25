const AREAS = [
  "Johannesburg CBD",
  "Soweto",
  "Sandton",
  "Randburg",
  "Roodepoort",
  "Alexandra",
  "Midrand",
  "Germiston",
];

function SkylineSilhouette() {
  return (
    <svg viewBox="0 0 600 160" className="h-full w-full text-rust" aria-hidden="true">
      <rect x="10" y="90" width="30" height="70" fill="currentColor" opacity="0.7" />
      <rect x="46" y="60" width="26" height="100" fill="currentColor" opacity="0.85" />
      <rect x="78" y="100" width="22" height="60" fill="currentColor" opacity="0.6" />
      <rect x="106" y="40" width="18" height="120" fill="currentColor" />
      <rect x="130" y="70" width="24" height="90" fill="currentColor" opacity="0.75" />
      <rect x="160" y="20" width="10" height="140" fill="currentColor" />
      <rect x="155" y="10" width="20" height="14" fill="currentColor" />
      <circle cx="165" cy="4" r="3" fill="currentColor" />
      <rect x="186" y="86" width="28" height="74" fill="currentColor" opacity="0.7" />
      <rect x="220" y="54" width="20" height="106" fill="currentColor" opacity="0.85" />
      <rect x="246" y="96" width="26" height="64" fill="currentColor" opacity="0.6" />
      <rect x="278" y="66" width="22" height="94" fill="currentColor" />
      <rect x="306" y="108" width="18" height="52" fill="currentColor" opacity="0.7" />
      <rect x="330" y="48" width="24" height="112" fill="currentColor" opacity="0.85" />
      <rect x="360" y="84" width="20" height="76" fill="currentColor" opacity="0.6" />
      <rect x="386" y="58" width="26" height="102" fill="currentColor" />
      <rect x="418" y="100" width="22" height="60" fill="currentColor" opacity="0.7" />
      <rect x="446" y="72" width="18" height="88" fill="currentColor" opacity="0.85" />
      <rect x="470" y="94" width="24" height="66" fill="currentColor" opacity="0.6" />
      <rect x="500" y="50" width="20" height="110" fill="currentColor" />
      <rect x="526" y="90" width="26" height="70" fill="currentColor" opacity="0.75" />
      <rect x="558" y="110" width="30" height="50" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function ServiceArea() {
  return (
    <section id="service-area" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-rust">
              Service Area
            </span>
            <h2 className="font-display mt-4 text-4xl text-ink sm:text-5xl">
              Born in Joburg. Delivering to Joburg.
            </h2>
            <p className="mt-5 text-lg text-ink/70">
              Mashesha runs out of Johannesburg and knows its streets, suburbs,
              and townships. Wherever you are in the city, our trucks are never
              far away.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {AREAS.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2 rounded-lg bg-ink/5 px-4 py-3 text-sm font-medium text-ink"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-rust" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl bg-ink p-8 sm:p-12">
            <SkylineSilhouette />
            <p className="mt-6 text-center text-xs uppercase tracking-widest text-cream/50">
              26.2041° S, 28.0473° E — Johannesburg, South Africa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceArea;
