import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const orderHistory = [
  { id: "ORD-001", date: "12 Jun 2026", items: "12kg × 1", total: "R 350", status: "Delivered" },
  { id: "ORD-002", date: "28 May 2026", items: "3kg × 2", total: "R 240", status: "Delivered" },
  { id: "ORD-003", date: "10 May 2026", items: "18kg × 1", total: "R 520", status: "Delivered" },
];

const statusColour: Record<string, string> = {
  Delivered: "text-green-600",
  Processing: "text-rust",
  Cancelled: "text-charcoal/40",
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Page header */}
        <div className="py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Account
          </span>
          <h1 className="font-display mt-4 text-5xl text-charcoal sm:text-6xl">
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
                <p className="font-semibold text-charcoal">{user.name}</p>
                <p className="text-sm text-charcoal/50">Customer</p>
              </div>
            </div>

            <div className="rounded-2xl border border-charcoal/10 bg-white p-6 space-y-4">
              <h2 className="font-display text-lg text-charcoal">Personal details</h2>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Email</p>
                <p className="mt-1 text-sm text-charcoal/80">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Phone</p>
                <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rust">Delivery address</p>
                <p className="mt-1 text-sm text-charcoal/40 italic">Not set</p>
              </div>
              <button className="mt-2 text-sm text-rust hover:text-rust-dark transition-colors duration-200">
                Edit details
              </button>
            </div>

            <div className="rounded-2xl border border-charcoal/10 bg-white p-6 space-y-3">
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
            <h2 className="font-display text-2xl text-charcoal mb-6">Order history</h2>
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-white px-6 py-5"
                >
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{order.id}</p>
                    <p className="mt-0.5 text-xs text-charcoal/50">{order.date} · {order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-charcoal">{order.total}</p>
                    <p className={`mt-0.5 text-xs font-medium ${statusColour[order.status] ?? "text-charcoal/50"}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
