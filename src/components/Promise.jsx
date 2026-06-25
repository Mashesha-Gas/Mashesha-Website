const STORY_POINTS = [
  {
    title: "The Flame",
    body: "Represents energy, warmth, and the reliable supply of gas to every home we reach.",
  },
  {
    title: "The Hidden J",
    body: 'Subtly forms a "J" for Johannesburg — our home, and our promise to the city.',
  },
  {
    title: "Zulu Pattern",
    body: "Inspired by African pathways, symbolising connection, movement, and community.",
  },
  {
    title: "Johannesburg Skyline",
    body: "A tribute to Joburg's heritage, resilience, and the communities we power every day.",
  },
];

function Promise() {
  return (
    <section id="about" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-rust">
              Our Promise
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
              Safe. Reliable. Accessible energy that keeps life moving.
            </h2>
            <p className="mt-6 text-lg text-ink/70">
              At Mashesha, our promise is simple: to deliver safe, reliable, and
              accessible energy that keeps life moving. Built from African
              pathways and inspired by Johannesburg's heritage, our brand is a
              reflection of who we are — rooted in community, driven by purpose,
              and committed to empowering everyday lives.
            </p>
            <p className="mt-4 font-display text-xl text-rust">
              Proudly Johannesburg. Proudly Mashesha.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {STORY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-ink/10 bg-white/40 p-6 transition-colors duration-200 hover:border-rust/40"
              >
                <h3 className="font-display text-base text-rust">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Promise;
