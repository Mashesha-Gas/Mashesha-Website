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

function toSessionUser({ token, customer }) {
  return {
    token,
    email: customer.customer_email,
    name: customer.customer_name || customer.customer_email.split("@")[0],
    mobile: customer.customer_mobile,
  };
}

async function postJson(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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

  async function login({ email, password }) {
    const data = await postJson("/api/customers/login", { email, password });
    persist(toSessionUser(data));
  }

  async function signup({ name, email, password }) {
    const data = await postJson("/api/customers", {
      customer_name: name,
      customer_email: email,
      customer_password: password,
    });
    persist(toSessionUser(data));
  }

  function logout() {
    localStorage.removeItem("mashesha_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut hook — import useAuth() anywhere instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
