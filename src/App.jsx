import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartToast from "./components/CartToast";
import HomePage from "./pages/HomePage";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import { useAuth } from "./context/AuthContext";

// Only the home page loads eagerly — it's the most common landing page and
// keeping it in the main bundle avoids a second round-trip for the typical
// visitor. Everything else is fetched on demand, which matters most on slow
// mobile connections where every unused kilobyte delays first paint.
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

// ProtectedRoute wraps pages that require login.
// If the user isn't signed in, it sends them to /login and remembers
// where they were trying to go so they can be sent back after signing in.
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <LocalBusinessSchema />
      <Header />
      <Suspense fallback={<div className="bg-cream min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Delivery Areas page is gone — its content moved into the home
              page's "Where are you?" quick-order picker. Redirect old links. */}
          <Route path="/locations" element={<Navigate to="/" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Footer />
      <CartToast />
    </>
  );
}

export default App;
