import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyOrders, ORDER_STATUS, isActiveOrder } from "../hooks/useOrders";
import { useInventoryList } from "../hooks/useInventory";
import { PROVINCES } from "../constants";
import SEO from "../components/SEO";

interface Order {
  order_id: number;
  order_items_json: string;
  order_total: number | string | null;
  order_date: string;
  order_status: number | null;
}

function formatOrderDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function itemsLabel(order: Order, labelById: Record<number, string>) {
  try {
    const items: { inventory_id: number; qty: number }[] = JSON.parse(order.order_items_json || "[]");
    return items.map((it) => `${labelById[it.inventory_id] ?? `Item #${it.inventory_id}`} × ${it.qty}`).join(", ");
  } catch {
    return "—";
  }
}

function formatAddress(address: any): string | null {
  if (!address) return null;
  return [
    address.address_line1,
    address.address_unit,
    address.address_line2,
    address.address_city,
    address.address_province,
    address.address_postcode,
  ].filter(Boolean).join(", ");
}

function buildEditForm(user: any) {
  const a = user.address;
  return {
    customer_name: user.name ?? "",
    customer_mobile: user.mobile ?? "",
    customer_company: user.company ?? "",
    address_line1: a?.address_line1 ?? "",
    address_line2: a?.address_line2 ?? "",
    address_unit: a?.address_unit ?? "",
    address_city: a?.address_city ?? "",
    address_province: a?.address_province ?? "",
    address_postcode: a?.address_postcode != null ? String(a.address_postcode) : "",
  };
}

function PersonalDetailsCard({ user, onSave }: { user: any; onSave: (fields: any) => Promise<unknown> }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => buildEditForm(user));

  const inputClass =
    "w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-rust focus:outline-none";
  const fieldLabelClass = "block text-xs font-semibold uppercase tracking-widest text-rust mb-1.5";

  function set<K extends keyof ReturnType<typeof buildEditForm>>(field: K, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEditing() {
    setForm(buildEditForm(user));
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your details.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    const addressLine = formatAddress(user.address);
    return (
      <div className="rounded-2xl bg-cream p-6 space-y-4">
        <h2 className="font-display text-lg text-charcoal">Personal details</h2>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rust">Email</p>
          <p className="mt-1 text-sm text-charcoal/80">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rust">Phone</p>
          {user.mobile ? <p className="mt-1 text-sm text-charcoal/80">{user.mobile}</p> : <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rust">Company</p>
          {user.company ? <p className="mt-1 text-sm text-charcoal/80">{user.company}</p> : <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rust">Delivery address</p>
          {addressLine ? <p className="mt-1 text-sm text-charcoal/80">{addressLine}</p> : <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>}
        </div>
        <button onClick={startEditing} className="mt-2 text-sm text-rust hover:text-rust-dark transition-colors duration-200">
          Edit details
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-cream p-6 space-y-4">
      <h2 className="font-display text-lg text-charcoal">Edit details</h2>
      {error && (
        <p className="rounded-lg border border-rust/30 bg-rust/10 px-3 py-2 text-xs text-rust">{error}</p>
      )}

      <div>
        <label className={fieldLabelClass}>Full name</label>
        <input className={inputClass} value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
      </div>
      <div>
        <label className={fieldLabelClass}>Phone</label>
        <input className={inputClass} value={form.customer_mobile} onChange={(e) => set("customer_mobile", e.target.value)} />
      </div>
      <div>
        <label className={fieldLabelClass}>Company (optional)</label>
        <input className={inputClass} value={form.customer_company} onChange={(e) => set("customer_company", e.target.value)} />
      </div>

      <div className="border-t border-charcoal/10 pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-rust">Delivery address</p>
        <input className={inputClass} placeholder="Street address" value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} />
        <input className={inputClass} placeholder="Unit / complex (optional)" value={form.address_unit} onChange={(e) => set("address_unit", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="City / suburb" value={form.address_city} onChange={(e) => set("address_city", e.target.value)} />
          <input
            className={inputClass}
            placeholder="Postal code"
            inputMode="numeric"
            value={form.address_postcode}
            onChange={(e) => set("address_postcode", e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
        </div>
        <select className={inputClass} value={form.address_province} onChange={(e) => set("address_province", e.target.value)}>
          <option value="">Select a province</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-rust px-5 py-2 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={saving}
          className="text-sm text-charcoal/50 hover:text-charcoal transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function OrderRow({ order, label }: { order: Order; label: string }) {
  const status = order.order_status != null ? ORDER_STATUS[order.order_status] : undefined;
  return (
    <div className="flex items-center justify-between rounded-2xl bg-cream px-6 py-5">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${status?.dot ?? "bg-charcoal/25"}`} />
        <div>
          <p className="text-sm font-semibold text-charcoal">Order #{order.order_id}</p>
          <p className="mt-0.5 text-xs text-charcoal/50">{formatOrderDate(order.order_date)} · {label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-charcoal">R {Number(order.order_total ?? 0).toLocaleString()}</p>
        <p className={`mt-0.5 text-xs font-medium ${status?.text ?? "text-charcoal/50"}`}>{status?.label ?? "Unknown"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useMyOrders(user?.token);
  const { items: inventory } = useInventoryList();

  const labelById = inventory.reduce<Record<number, string>>((map, item) => {
    map[item.inventory_id] = item.inventory_size || item.inventory_name;
    return map;
  }, {});

  function handleSignOut() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  const activeOrders = orders.filter(isActiveOrder);
  const pastOrders = orders.filter((o) => !isActiveOrder(o));

  return (
    <main className="bg-rust min-h-screen pt-24 pb-20">
      <SEO title="My Profile | Mashesha" description="View your Mashesha account and order history." path="/profile" noIndex />
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Page header */}
        <div className="py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            Account
          </span>
          <h1 className="font-display mt-4 text-5xl text-cream sm:text-6xl">
            My profile.
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Profile details */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rust text-cream font-display text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-cream">{user.name}</p>
                <p className="text-sm text-cream/60">Customer</p>
              </div>
            </div>

            <PersonalDetailsCard user={user} onSave={updateProfile} />

            <div className="rounded-2xl bg-cream p-6 space-y-3">
              <Link
                to="/cart"
                className="flex items-center justify-between text-sm text-charcoal/70 hover:text-rust transition-colors duration-200"
              >
                <span>My cart</span>
                <span>→</span>
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between text-sm text-charcoal/70 hover:text-rust transition-colors duration-200"
              >
                <span>Order again</span>
                <span>→</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-between text-sm text-charcoal/40 hover:text-rust transition-colors duration-200"
              >
                <span>Sign out</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Order history */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-cream mb-6">Order history</h2>

            {ordersLoading ? (
              <div className="rounded-2xl bg-cream/20 px-6 py-4 text-sm text-cream/50">Loading your orders…</div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl bg-cream/20 px-6 py-4 text-sm text-cream/50">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Active */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cream/50 mb-3">Active</p>
                  {activeOrders.length === 0 ? (
                    <div className="rounded-2xl bg-cream/20 px-6 py-4 text-sm text-cream/50">No active orders right now.</div>
                  ) : (
                    <div className="space-y-3">
                      {activeOrders.map((order) => (
                        <OrderRow key={order.order_id} order={order} label={itemsLabel(order, labelById)} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Past */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cream/50 mb-3">Past</p>
                  {pastOrders.length === 0 ? (
                    <div className="rounded-2xl bg-cream/20 px-6 py-4 text-sm text-cream/50">No past orders yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {pastOrders.map((order) => (
                        <OrderRow key={order.order_id} order={order} label={itemsLabel(order, labelById)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
