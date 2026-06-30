import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LocationsPage from "./pages/LocationsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
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
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:size" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage />} />
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
    </>
  );
}

export default App;
