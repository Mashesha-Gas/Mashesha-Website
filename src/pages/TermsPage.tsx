const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: "By ordering from Mashesha — by phone, WhatsApp, or through this website — you agree to these terms and conditions. If you don't agree with any part of them, please don't place an order.",
  },
  {
    title: "2. Orders & delivery",
    body: "Orders placed before noon are delivered the same day across most of Johannesburg, subject to stock and location. Delivery windows given at checkout are estimates, not guarantees — traffic, weather, and demand can affect timing.",
  },
  {
    title: "3. Pricing & payment",
    body: "Prices shown at checkout are the prices charged. We reserve the right to change prices at any time without prior notice; changes won't affect orders already confirmed. Payment is due on delivery unless another method has been agreed in advance.",
  },
  {
    title: "4. Cylinder deposits & exchanges",
    body: "Where a cylinder exchange applies, you must hand over an empty cylinder of the matching size in reasonable condition. Cylinders remain the property of Mashesha or our supplying brand until a deposit is paid in full for a new connection.",
  },
  {
    title: "5. Safety compliance",
    body: "All cylinders we deliver are inspected and refilled to South African LPG safety standards (SANS 10087). It remains your responsibility to store and use LPG cylinders safely — in a ventilated, upright position, away from open flames and out of reach of children.",
  },
  {
    title: "6. Liability",
    body: "Mashesha is not liable for damage or injury arising from incorrect storage, handling, or use of a cylinder after delivery. Please inspect your cylinder and fittings on delivery and raise any concerns with our driver immediately.",
  },
  {
    title: "7. Cancellations & refunds",
    body: "You may cancel an order any time before it's dispatched for delivery at no charge. Once a cylinder has left our depot, cancellations are handled case by case. Faulty or leaking cylinders will be replaced free of charge.",
  },
  {
    title: "8. Changes to these terms",
    body: "We may update these terms from time to time to reflect changes in our service or the law. The version published on this page is always the current one.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-rust">
          Legal
        </span>
        <h1 className="font-display mt-4 text-4xl text-charcoal sm:text-5xl">
          Terms & Conditions.
        </h1>
        <p className="mt-5 text-charcoal/65 leading-relaxed">
          These terms govern every order placed with Mashesha. Please read them
          before you order — they cover delivery, pricing, cylinder safety, and
          what to expect from us.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-t border-charcoal/10 pt-6">
              <h2 className="font-display text-xl text-charcoal">{section.title}</h2>
              <p className="mt-3 text-sm text-charcoal/65 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-rust/10 border border-rust/20 p-7">
          <p className="text-sm font-semibold text-charcoal">Questions about these terms?</p>
          <p className="mt-2 text-sm text-charcoal/65">
            Reach out at{" "}
            <a href="mailto:info@mashesha.co.za" className="text-rust hover:text-rust-dark">
              info@mashesha.co.za
            </a>{" "}
            or +27 11 123 4567.
          </p>
        </div>
      </div>
    </main>
  );
}
