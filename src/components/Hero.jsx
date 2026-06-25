import FlameLogo from "./FlameLogo";

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pattern-zulu pointer-events-none absolute inset-0 text-rust opacity-[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[640px] w-[420px] -translate-y-1/2 text-rust/25 sm:block"
      >
        <FlameLogo className="h-full w-full [--logo-skyline:transparent]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-rust/40 bg-rust/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rust">
            Proudly Johannesburg
          </span>

          <h1 className="font-display mt-6 text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            Gas on tap.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-cream/80 sm:text-xl">
            Safe, reliable, accessible energy that keeps Johannesburg moving —
            delivered straight to your door, every time you call.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-rust px-7 py-3.5 text-base font-semibold text-cream shadow-lg shadow-rust/20 transition-colors duration-200 hover:bg-rust-dark cursor-pointer"
            >
              Order Gas Now
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full border border-cream/30 px-7 py-3.5 text-base font-semibold text-cream transition-colors duration-200 hover:border-cream hover:bg-cream/10 cursor-pointer"
            >
              View Cylinder Sizes
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-cream/10 pt-8">
            <div>
              <dt className="sr-only">Delivery</dt>
              <dd className="font-display text-2xl text-cream sm:text-3xl">24hr</dd>
              <dd className="mt-1 text-xs text-cream/60">Fast delivery</dd>
            </div>
            <div>
              <dt className="sr-only">Safety standard</dt>
              <dd className="font-display text-2xl text-cream sm:text-3xl">SANS</dd>
              <dd className="mt-1 text-xs text-cream/60">Certified safety</dd>
            </div>
            <div>
              <dt className="sr-only">Coverage</dt>
              <dd className="font-display text-2xl text-cream sm:text-3xl">JHB</dd>
              <dd className="mt-1 text-xs text-cream/60">Wide coverage</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:max-w-none">
          <div className="relative aspect-square w-full max-w-md rounded-[2.5rem] bg-gradient-to-br from-rust/20 via-rust/5 to-transparent p-10 sm:p-14">
            <FlameLogo className="h-full w-full text-cream drop-shadow-[0_20px_40px_rgba(177,67,5,0.35)] [--logo-skyline:#b14305]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
