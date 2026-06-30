import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from ?? "/profile";

  function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!email || !password) { setError("Please fill in all fields."); return; }
    login({ email, password });
    navigate(from, { replace: true });
  }

  function handleSignup(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    signup({ name, email, password });
    navigate(from, { replace: true });
  }

  const inputClass =
    "w-full rounded-xl bg-white border border-charcoal/15 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-rust focus:outline-none";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-rust mb-2";

  return (
    <main className="bg-cream min-h-screen flex items-center justify-center pt-20 px-5 pb-12">
      <div className="w-full max-w-md">

        <Link to="/" className="inline-block mb-10 text-charcoal/50 text-sm hover:text-charcoal transition-colors duration-200">
          ← Back to Mashesha
        </Link>

        {/* Tabs */}
        <div className="flex rounded-xl border border-charcoal/10 bg-white p-1 mb-8">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors duration-200 ${
              tab === "login" ? "bg-rust text-cream" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors duration-200 ${
              tab === "signup" ? "bg-rust text-cream" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
            {error}
          </p>
        )}

        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <h1 className="font-display text-3xl text-charcoal">Welcome back.</h1>
            <p className="text-sm text-charcoal/50">Log in to view your profile and order history.</p>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input name="password" type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <button type="submit" className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
              Log in
            </button>
            <p className="text-center text-xs text-charcoal/40">
              No account yet?{" "}
              <button type="button" onClick={() => { setTab("signup"); setError(""); }} className="text-rust hover:text-rust-dark transition-colors duration-200">
                Sign up
              </button>
            </p>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-5">
            <h1 className="font-display text-3xl text-charcoal">Create an account.</h1>
            <p className="text-sm text-charcoal/50">Sign up to track your orders and save your details.</p>
            <div>
              <label className={labelClass}>Full name</label>
              <input name="name" type="text" required placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input name="password" type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm password</label>
              <input name="confirm" type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <button type="submit" className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark">
              Create account
            </button>
            <p className="text-center text-xs text-charcoal/40">
              Already have an account?{" "}
              <button type="button" onClick={() => { setTab("login"); setError(""); }} className="text-rust hover:text-rust-dark transition-colors duration-200">
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
