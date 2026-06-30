import { createContext, useContext, useState } from "react";

// AuthContext holds the logged-in user and the functions to log in, sign up, and log out.
// Any component in the app can call useAuth() to read or change auth state.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Check localStorage on first load so the user stays logged in after a page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mashesha_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login({ email, password }) {
    // TODO: replace with a real API call
    const loggedInUser = { name: email.split("@")[0], email };
    localStorage.setItem("mashesha_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  function signup({ name, email, password }) {
    // TODO: replace with a real API call
    const newUser = { name, email };
    localStorage.setItem("mashesha_user", JSON.stringify(newUser));
    setUser(newUser);
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
