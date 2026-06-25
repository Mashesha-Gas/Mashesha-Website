const STEPS = [
  {
    number: "01",
    title: "Call or order online",
    desc: "Tell us your cylinder size and address — we'll confirm your order in minutes.",
  },
  {
    number: "02",
    title: "We dispatch from Joburg",
    desc: "Your order is loaded onto a Mashesha truck and routed to your area same day.",
  },
  {
    number: "03",
    title: "Safe delivery to your door",
    desc: "Our trained team handles every cylinder to SANS safety standards, no exceptions.",
  },
  {
    number: "04",
    title: "Gas on tap",
    desc: "Connect, light up, and keep life moving — refills are just a call away.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            How It Works
          </span>
          <h2 className="font-display mt-4 text-4xl text-ink sm:text-5xl">
            From call to cylinder, fast.
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.number} className="relative rounded-2xl bg-white/50 p-7">
              <span className="font-display text-5xl text-rust/25">{step.number}</span>
              <h3 className="font-display mt-4 text-xl text-ink">{step.title}</h3>
              <p className="mt-3 text-sm text-ink/65">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <svg
                  viewBox="0 0 24 24"
                  className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-rust lg:block"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
