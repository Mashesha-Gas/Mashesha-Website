const CONTACT_ITEMS = [
  {
    label: "Call us",
    value: "+27 11 123 4567",
    href: "tel:+27111234567",
    icon: (
      <path
        d="M6 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C12.5 22 2 11.5 2 4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    label: "Email us",
    value: "info@mashesha.co.za",
    href: "mailto:info@mashesha.co.za",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M3 6.5L12 13L21 6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </>
    ),
  },
  {
    label: "Visit us",
    value: "Johannesburg, South Africa",
    href: "https://www.mashesha.co.za",
    icon: (
      <>
        <path
          d="M12 22S20 14.5 20 9A8 8 0 0 0 4 9C4 14.5 12 22 12 22Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </>
    ),
  },
];

function ContactCTA() {
  return (
    <section id="contact" className="bg-rust py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl text-cream sm:text-5xl">
              Ready for gas on tap?
            </h2>
            <p className="mt-5 max-w-lg text-lg text-cream/85">
              Call our team or send a message and we'll get a cylinder to your
              door — safe, reliable, and on time.
            </p>

            <form
              className="mt-9 flex flex-col gap-4 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="contact-phone" className="sr-only">
                Phone number
              </label>
              <input
                id="contact-phone"
                type="tel"
                required
                placeholder="Your phone number"
                className="w-full rounded-full border border-cream/30 bg-ink/10 px-5 py-3.5 text-base text-cream placeholder:text-cream/60 focus:border-cream focus:bg-ink/20 focus:outline-none sm:flex-1"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-cream transition-colors duration-200 hover:bg-ink-light cursor-pointer"
              >
                Request a Callback
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 rounded-2xl bg-cream/10 px-6 py-5 transition-colors duration-200 hover:bg-cream/20 cursor-pointer"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-rust">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-cream/70">
                    {item.label}
                  </span>
                  <span className="block text-base font-semibold text-cream">
                    {item.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
