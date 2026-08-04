import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartToast from "./components/CartToast";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LocationsPage from "./pages/LocationsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import TermsPage from "./pages/TermsPage";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import { useAuth } from "./context/AuthContext";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<AuthPage />} />
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
      <Footer />
      <CartToast />
    </>
  );
}

export default App;
