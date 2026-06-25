const PILLARS = [
  {
    title: "Safe",
    desc: "Every cylinder is inspected, pressure-tested, and handled to SANS safety standards from depot to doorstep.",
    icon: (
      <path
        d="M16 4L26 8V16C26 23 21 27.5 16 29C11 27.5 6 23 6 16V8L16 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Reliable",
    desc: "Same-day delivery across Johannesburg with a team that shows up when they say they will, every time.",
    icon: (
      <>
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M16 9V16L21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Accessible",
    desc: "Cylinder sizes and pricing for every household and business — from a single plate to a full kitchen.",
    icon: (
      <>
        <circle cx="16" cy="11" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M6 27C6 21.5 10.5 18 16 18C21.5 18 26 21.5 26 27"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

function WhyMashesha() {
  return (
    <section id="why-mashesha" className="bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Why Mashesha
          </span>
          <h2 className="font-display mt-4 text-4xl text-cream sm:text-5xl">
            Energy you can count on.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-cream/10 p-8 transition-colors duration-200 hover:border-rust/50"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rust/15 text-rust">
                <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
                  {pillar.icon}
                </svg>
              </span>
              <h3 className="font-display mt-6 text-2xl text-cream">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyMashesha;
