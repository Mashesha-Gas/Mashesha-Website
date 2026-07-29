import { createContext, useContext, useState } from "react";

// CartContext holds the items in the user's cart and the functions to change them.
// Any component in the app can call useCart() to read or change cart state.

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("mashesha_cart");
    return saved ? JSON.parse(saved) : [];
  });

  function persist(next) {
    localStorage.setItem("mashesha_cart", JSON.stringify(next));
    setItems(next);
  }

  // Accepts a raw Inventory row from the API and adds it to the cart,
  // merging into an existing line if that product is already in there.
  function addItem(product, qty = 1) {
    const price =
      product.inventory_sale != null && Number(product.inventory_sale) < Number(product.inventory_price)
        ? Number(product.inventory_sale)
        : Number(product.inventory_price);
    const size = product.inventory_size || product.inventory_name;
    const id = product.inventory_id;

    const existing = items.find((item) => item.id === id);
    if (existing) {
      persist(items.map((item) => (item.id === id ? { ...item, qty: item.qty + qty } : item)));
    } else {
      persist([...items, { id, size, tagline: product.inventory_brand || "", price, qty }]);
    }
  }

  function increment(id) {
    persist(items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
  }

  function decrement(id) {
    persist(
      items.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item))
    );
  }

  function removeItem(id) {
    persist(items.filter((item) => item.id !== id));
  }

  return (
    <CartContext.Provider value={{ items, addItem, increment, decrement, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

// Shortcut hook — import useCart() anywhere instead of useContext(CartContext)
export function useCart() {
  return useContext(CartContext);
}
