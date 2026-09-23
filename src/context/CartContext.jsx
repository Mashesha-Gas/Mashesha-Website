import { createContext, useContext, useState } from "react";

// CartContext holds the items in the user's cart and the functions to change them.
// Any component in the app can call useCart() to read or change cart state.

const CartContext = createContext(null);

// The same cylinder size can sit in the cart twice — once as a refill/
// exchange, once as a new cylinder (with its deposit) — so lines are keyed
// by product + purchaseType, not just product id. Exported so pages can use
// the same key as a React `key` prop.
export function lineKey(id, purchaseType) {
  return `${id}:${purchaseType}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("mashesha_cart");
    // Carts saved before purchaseType existed just get treated as refills —
    // that was the only option at the time, and it's the cheaper default.
    return saved ? JSON.parse(saved).map((item) => ({ purchaseType: "refill", deposit: 0, ...item })) : [];
  });
  // Set on every addItem() call so <CartToast> can slide in — a new object
  // (via ts) even for the same product, so re-adding retriggers the popup.
  const [toast, setToast] = useState(null);

  function persist(next) {
    localStorage.setItem("mashesha_cart", JSON.stringify(next));
    setItems(next);
  }

  // Accepts a raw Inventory row from the API and adds it to the cart,
  // merging into an existing line if that same product + purchaseType is
  // already in there. purchaseType "new" carries the item's cylinder
  // deposit (inventory_deposit) as a separate per-unit amount — refills
  // never do, since the customer already owns a cylinder to exchange.
  // { silent: true } skips the toast — for flows like the home page's
  // quick-order wizard, where "Added to cart" plus a "View cart" link would
  // just invite someone away from the step they're on.
  function addItem(product, qty = 1, { purchaseType = "refill", silent = false } = {}) {
    const price =
      product.inventory_sale != null && Number(product.inventory_sale) < Number(product.inventory_price)
        ? Number(product.inventory_sale)
        : Number(product.inventory_price);
    const deposit = purchaseType === "new" ? Number(product.inventory_deposit) || 0 : 0;
    const size = product.inventory_size || product.inventory_name;
    const id = product.inventory_id;
    const key = lineKey(id, purchaseType);

    const existing = items.find((item) => lineKey(item.id, item.purchaseType) === key);
    if (existing) {
      persist(items.map((item) => (lineKey(item.id, item.purchaseType) === key ? { ...item, qty: item.qty + qty } : item)));
    } else {
      persist([
        ...items,
        { id, size, tagline: product.inventory_brand || "", price, deposit, purchaseType, qty, vendorId: product.inventory_vendor_id },
      ]);
    }

    if (silent) return;

    setToast({
      id,
      size,
      qty,
      price: price + deposit,
      purchaseType,
      thumbnailPath: product.inventory_thumbnail_path || null,
      ts: Date.now(),
    });
  }

  function increment(id, purchaseType) {
    const key = lineKey(id, purchaseType);
    persist(items.map((item) => (lineKey(item.id, item.purchaseType) === key ? { ...item, qty: item.qty + 1 } : item)));
  }

  function decrement(id, purchaseType) {
    const key = lineKey(id, purchaseType);
    persist(
      items.map((item) => (lineKey(item.id, item.purchaseType) === key ? { ...item, qty: Math.max(1, item.qty - 1) } : item))
    );
  }

  function removeItem(id, purchaseType) {
    const key = lineKey(id, purchaseType);
    persist(items.filter((item) => lineKey(item.id, item.purchaseType) !== key));
  }

  function clearCart() {
    persist([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, increment, decrement, removeItem, clearCart, toast }}>
      {children}
    </CartContext.Provider>
  );
}

// Shortcut hook — import useCart() anywhere instead of useContext(CartContext)
export function useCart() {
  return useContext(CartContext);
}
