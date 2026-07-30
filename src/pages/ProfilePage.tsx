import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyOrders, ORDER_STATUS, isActiveOrder } from "../hooks/useOrders";
import { useInventoryList } from "../hooks/useInventory";

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
  const { user, logout } = useAuth();
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

            <div className="rounded-2xl bg-cream p-6 space-y-4">
              <h2 className="font-display text-lg text-charcoal">Personal details</h2>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Email</p>
                <p className="mt-1 text-sm text-charcoal/80">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Phone</p>
                {user.mobile ? (
                  <p className="mt-1 text-sm text-charcoal/80">{user.mobile}</p>
                ) : (
                  <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Delivery address</p>
                <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>
              </div>
              <button className="mt-2 text-sm text-rust hover:text-rust-dark transition-colors duration-200">
                Edit details
              </button>
            </div>

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
