import { createContext, useContext, useState } from "react";

// AuthContext holds the logged-in user and the functions to log in, sign up, and log out.
// Any component in the app can call useAuth() to read or change auth state.

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

// Reads the JWT's expiry without verifying the signature — just enough to
// know whether a stored session has gone stale since the last visit.
function tokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function loadStoredUser() {
  const saved = localStorage.getItem("mashesha_user");
  if (!saved) return null;
  const parsed = JSON.parse(saved);
  const exp = tokenExpiryMs(parsed.token);
  if (exp && exp < Date.now()) {
    localStorage.removeItem("mashesha_user");
    return null;
  }
  return parsed;
}

// `customer` here is whatever /api/customers/{login,me} returns — includes
// `address` (the joined Addresses row, or null) alongside the plain fields.
function toSessionUser(token, customer) {
  return {
    token,
    email: customer.customer_email,
    name: customer.customer_name || customer.customer_email.split("@")[0],
    mobile: customer.customer_mobile,
    company: customer.customer_company,
    address: customer.address ?? null,
  };
}

async function request(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export function AuthProvider({ children }) {
  // Check localStorage on first load so the user stays logged in after a page refresh
  const [user, setUser] = useState(loadStoredUser);

  function persist(sessionUser) {
    localStorage.setItem("mashesha_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
  }

  // Fetches the full profile for a token and makes it the active session —
  // shared by login/signup and by checkout's "create an account" flow, which
  // already has a token from POST /customers by the time it wants to log in.
  async function establishSession(token) {
    const customer = await request("/api/customers/me", { token });
    persist(toSessionUser(token, customer));
  }

  async function login({ email, password }) {
    const { token } = await request("/api/customers/login", { method: "POST", body: { email, password } });
    await establishSession(token);
  }

  async function signup({ name, email, password }) {
    const { token } = await request("/api/customers", {
      method: "POST",
      body: { customer_name: name, customer_email: email, customer_password: password },
    });
    await establishSession(token);
  }

  async function forgotPassword({ email }) {
    await request("/api/customers/forgot-password", { method: "POST", body: { email } });
  }

  async function resetPassword({ token, password }) {
    await request("/api/customers/reset-password", { method: "POST", body: { token, password } });
  }

  // Accepts any subset of { customer_name, customer_mobile, customer_company,
  // customer_password, address_line1, address_line2, address_unit, address_city,
  // address_postcode, address_province } — omitted fields keep their current value.
  async function updateProfile(fields) {
    if (!user) throw new Error("Not logged in");
    const customer = await request("/api/customers/me", { method: "PUT", token: user.token, body: fields });
    persist(toSessionUser(user.token, customer));
    return customer;
  }

  function logout() {
    localStorage.removeItem("mashesha_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, establishSession, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut hook — import useAuth() anywhere instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
