import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setSubmitting(true);
    try {
      await resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

        {!token ? (
          <div className="space-y-5">
            <h1 className="font-display text-3xl text-charcoal">Invalid link.</h1>
            <p className="text-sm text-charcoal/50">
              This reset link is missing its token. Request a new one from the sign-in page.
            </p>
            <Link
              to="/login"
              className="block w-full text-center rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              Go to sign in
            </Link>
          </div>
        ) : success ? (
          <div className="space-y-5">
            <h1 className="font-display text-3xl text-charcoal">Password updated.</h1>
            <p className="text-sm text-charcoal/50">Sign in with your new password to continue.</p>
            <Link
              to="/login"
              className="block w-full text-center rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="font-display text-3xl text-charcoal">Set a new password.</h1>
            <p className="text-sm text-charcoal/50">Choose a new password for your Mashesha account.</p>

            {error && (
              <p className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
                {error}
              </p>
            )}

            <div>
              <label className={labelClass}>New password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={inputClass}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={inputClass}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-rust py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-rust-dark disabled:opacity-60"
            >
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
