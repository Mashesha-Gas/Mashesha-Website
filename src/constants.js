// Flat delivery fee, waived for suburbs an admin has marked free-shipping
// (DeliveryAreas.delivery_area_free_shipping) — shared by checkout and the
// home page's quick-order flow so the two never quote a different amount.
export const DELIVERY_FEE = 50;

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

// Fallback only: the stores and their trading hours now come from the API
// (hooks/useCollectionPoints.js), kept current by each vendor in the
// terminal. This list is what shows if the API can't be reached.
export const COLLECTION_POINTS = [
  {
    id: "jules-street",
    name: "Jules Street store",
    address: "Cnr Grace St & 103 Jules St, Jeppestown, Johannesburg, 2001",
    hours: [
      { label: "Mon – Fri", time: "8 am – 4:45 pm" },
      { label: "Saturday", time: "8 am – 1 pm" },
      { label: "Sunday", time: "Closed" },
    ],
  },
  {
    id: "warrior-paint",
    name: "Warrior Paint, Norwood",
    address: "80 Iris Rd, Norwood, Johannesburg, 5067",
    hours: [
      { label: "Mon – Fri", time: "7:30 am – 5 pm" },
      { label: "Saturday", time: "7:30 am – 4 pm" },
      { label: "Sunday", time: "8 am – 12 pm" },
    ],
  },
];

// Paying means leaving the site for Yoco's hosted checkout, so the data the
// return page needs to show a receipt can't stay in memory — CheckoutPage
// stashes it under this key and CheckoutCompletePage reads it back.
export const CHECKOUT_STASH_KEY = "mashesha.checkout.pending";
