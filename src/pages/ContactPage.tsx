import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useDeliveryAreas } from "../hooks/useDeliveryAreas";
import { useInventoryList, CYLINDER_TYPE } from "../hooks/useInventory";
import { COLLECTION_POINTS } from "../constants";
import { TradingHours, mapLink } from "../components/CollectionOptions";
import { whatsAppLink } from "../utils/whatsapp";
import { MASHESHA_VCARD_URL } from "../utils/saveContact";

const API = import.meta.env.VITE_API_URL;

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

type FormState = {
  name: string;
  whatsapp: string;
  suburb: string;
  householdType: "household" | "business";
  usualSize: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  whatsapp: "",
  suburb: "",
  householdType: "household",
  usualSize: "",
  message: "",
};

export default function ContactPage() {
  const { activeAreas } = useDeliveryAreas();
  const { items } = useInventoryList();
  const cylinderSizes = Array.from(
    new Set(
      items
        .filter((i) => i.inventory_type === CYLINDER_TYPE)
        .map((i) => i.inventory_size)
        .filter(Boolean)
    )
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{ consented: boolean } | null>(null);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.name.trim()) e2.name = "Enter your name.";
    if (form.whatsapp.replace(/\D/g, "").length < 10) e2.whatsapp = "Enter a valid WhatsApp number.";
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setSubmitError("");
    setSubmitting(true);
    try {
      await postJson("/api/subscribers", {
        subscriber_name: form.name,
        subscriber_whatsapp: form.whatsapp,
        subscriber_suburb: form.suburb || null,
        subscriber_household_type: form.householdType,
        subscriber_usual_size: form.usualSize || null,
        subscriber_message: form.message || null,
        subscriber_consent: consent,
        subscriber_consent_source: "contact_form",
      });
      setResult({ consented: consent });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't send that. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function sendAnother() {
    setForm(EMPTY_FORM);
    setConsent(false);
    setResult(null);
  }

  const inputClass = (field: string) =>
    `w-full rounded-xl bg-cream border px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none ${
      errors[field] ? "border-red-400" : "border-cream/40"
    }`;
  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-cream/70 mb-2";

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <SEO
        title="Contact Mashesha | Join Our WhatsApp List"
        description="Join Mashesha's WhatsApp list for specials and updates, or send us a general enquiry. Order gas from the home page or on WhatsApp."
        path="/contact"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Page header */}
        <div className="py-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Get in touch
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Join our WhatsApp list.
          </h1>
          <p className="mt-5 text-lg text-charcoal/65">
            Sign up for specials, restock alerts, and updates on WhatsApp — or just
            send us a general question below.{" "}
            <Link to="/#order" className="font-semibold text-rust hover:underline">
              Ready to order?
            </Link>{" "}
            Head to the home page to order online, or{" "}
            <a href={whatsAppLink("Hi Mashesha, I'd like to order gas.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust hover:underline">
              order on WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-8">
            {[
              { label: "Phone", value: "+27 11 123 4567", href: "tel:+27111234567" },
              { label: "WhatsApp", value: "Chat with us on WhatsApp", href: "https://wa.me/27111234567" },
              { label: "Email", value: "info@mashesha.co.za", href: "mailto:info@mashesha.co.za" },
            ].map((item) => (
              <div key={item.label} className="border-t border-charcoal/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">
                  {item.label}
                </p>
                <a
                  href={item.href}
                  className="mt-2 block text-lg text-charcoal transition-colors duration-200 hover:text-rust"
                >
                  {item.value}
                </a>
              </div>
            ))}

            {/* Collection points — replaces the old generic "Johannesburg" location line */}
            <div className="border-t border-charcoal/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust">
                Collect in store
              </p>
              <div className="mt-4 space-y-5">
                {COLLECTION_POINTS.map((point) => (
                  <div key={point.id} className="rounded-2xl bg-rust/10 border border-rust/20 p-5">
                    <p className="text-sm font-semibold text-charcoal">{point.name}</p>
                    <p className="mt-1 text-xs text-charcoal/50">{point.address}</p>
                    <TradingHours point={point} className="mt-3" />
                    <a
                      href={mapLink(point)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rust hover:underline"
                    >
                      Get directions →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact / sign-up form */}
          <div className="rounded-2xl bg-rust p-8">
            {result ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <span className="text-4xl text-cream">✓</span>
                <h2 className="font-display mt-4 text-2xl text-cream">
                  {result.consented ? "You're on the list!" : "Message sent!"}
                </h2>
                <p className="mt-3 text-cream/70 text-sm">
                  {result.consented
                    ? "We'll get back to you within a few hours during trading hours, and you'll start getting our WhatsApp specials and updates."
                    : "We'll get back to you within a few hours during trading hours."}
                </p>

                {result.consented && (
                  <div className="mt-6 w-full rounded-2xl bg-cream/10 border border-cream/20 p-6">
                    <p className="text-sm font-semibold text-cream">Save our number</p>
                    <p className="mt-2 text-xs text-cream/70 leading-relaxed">
                      WhatsApp only delivers our broadcasts to people who have us saved as a
                      contact — tap below to add Mashesha Gas to your phone.
                    </p>
                    <a
                      href={MASHESHA_VCARD_URL}
                      download="Mashesha-Gas.vcf"
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-rust transition-colors duration-200 hover:bg-cream-dim"
                    >
                      Save our number
                    </a>
                  </div>
                )}

                <button
                  onClick={sendAnother}
                  className="mt-6 text-sm text-cream hover:text-cream/70 transition-colors duration-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-2xl text-cream">Sign up / send a message</h2>

                {submitError && (
                  <p className="rounded-xl border border-cream/30 bg-cream/10 px-4 py-3 text-sm text-cream">{submitError}</p>
                )}

                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-cream">{errors.name}</p>}
                </div>

                <div>
                  <label className={labelClass}>WhatsApp number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 082 123 4567"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    className={inputClass("whatsapp")}
                  />
                  {errors.whatsapp && <p className="mt-1.5 text-xs text-cream">{errors.whatsapp}</p>}
                </div>

                <div>
                  <label className={labelClass}>Suburb</label>
                  <select
                    value={form.suburb}
                    onChange={(e) => update("suburb", e.target.value)}
                    className={inputClass("suburb")}
                  >
                    <option value="">Select your suburb (optional)</option>
                    {activeAreas.map((a) => (
                      <option key={a.delivery_area_id} value={a.delivery_area_name}>{a.delivery_area_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Household or business</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => update("householdType", "household")}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                        form.householdType === "household" ? "border-cream bg-cream text-rust" : "border-cream/30 text-cream/70"
                      }`}
                    >
                      Household
                    </button>
                    <button
                      type="button"
                      onClick={() => update("householdType", "business")}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                        form.householdType === "business" ? "border-cream bg-cream text-rust" : "border-cream/30 text-cream/70"
                      }`}
                    >
                      Business
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Usual cylinder size</label>
                  <select
                    value={form.usualSize}
                    onChange={(e) => update("usualSize", e.target.value)}
                    className={inputClass("usualSize")}
                  >
                    <option value="">Select a size (optional)</option>
                    {cylinderSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="What do you need? e.g. 'I need a 9kg refill delivered to Kensington today'"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputClass("message")} resize-none`}
                  />
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-cream/30 bg-cream/10 p-4">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-cream/50 text-rust focus:ring-rust"
                  />
                  <span className="text-xs text-cream/80 leading-relaxed">
                    Yes, send me WhatsApp updates and offers from Mashesha. You can opt out
                    at any time by replying "STOP" to any message, or by contacting us.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-charcoal py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-charcoal/85 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
