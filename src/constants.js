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

// Exact street addresses aren't published yet — customers get those when
// we confirm their collection after checkout. Trading hours are the same
// every weekday at each location, so they're pre-grouped here rather than
// listed day by day.
export const COLLECTION_POINTS = [
  {
    id: "jules-street",
    name: "Jules Street store",
    hours: [
      { label: "Mon – Fri", time: "8 am – 4:45 pm" },
      { label: "Saturday", time: "8 am – 1 pm" },
      { label: "Sunday", time: "Closed" },
    ],
  },
  {
    id: "warrior-paint",
    name: "Warrior Paint, Norwood",
    hours: [
      { label: "Mon – Fri", time: "7:30 am – 5 pm" },
      { label: "Saturday", time: "7:30 am – 4 pm" },
      { label: "Sunday", time: "8 am – 12 pm" },
    ],
  },
];
