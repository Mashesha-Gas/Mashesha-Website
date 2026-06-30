import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-xl bg-white border border-charcoal/15 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-rust focus:outline-none";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-rust mb-2";

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Page header */}
        <div className="py-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Get in touch
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Contact us.
          </h1>
          <p className="mt-5 text-lg text-charcoal/65">
            To order gas, ask a question, or arrange a delivery — reach out
            by phone, WhatsApp, email, or the form below.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-8">
            {[
              { label: "Phone", value: "+27 11 123 4567", href: "tel:+27111234567" },
              { label: "WhatsApp", value: "Chat with us on WhatsApp", href: "https://wa.me/27111234567" },
              { label: "Email", value: "info@mashesha.co.za", href: "mailto:info@mashesha.co.za" },
              { label: "Location", value: "Johannesburg, Gauteng, South Africa", href: null },
            ].map((item) => (
              <div key={item.label} className="border-t border-charcoal/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-2 block text-lg text-charcoal transition-colors duration-200 hover:text-rust"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg text-charcoal">{item.value}</p>
                )}
              </div>
            ))}

            <div className="rounded-2xl bg-rust/10 border border-rust/20 p-7">
              <p className="text-sm font-semibold text-charcoal">Trading hours</p>
              <ul className="mt-3 space-y-1 text-sm text-charcoal/65">
                <li>Monday – Friday: 7:00 am – 7:00 pm</li>
                <li>Saturday: 8:00 am – 5:00 pm</li>
                <li>Sunday & Public Holidays: 9:00 am – 3:00 pm</li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-charcoal/10 bg-white p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <span className="text-4xl text-rust">✓</span>
                <h2 className="font-display mt-4 text-2xl text-charcoal">Message sent!</h2>
                <p className="mt-3 text-charcoal/65 text-sm">
                  We'll get back to you within a few hours during trading hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-rust hover:text-rust-dark transition-colors duration-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-2xl text-charcoal">Send a message</h2>

                <div>
                  <label className={labelClass}>Name</label>
                  <input type="text" name="name" required placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone / WhatsApp</label>
                  <input type="tel" name="phone" placeholder="e.g. 082 123 4567" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="What do you need? e.g. 'I need a 12kg refill delivered to Soweto today'"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
