const AREAS_SERVED = [
  "Jeppestown", "Johannesburg", "Soweto", "Sandton", "Randburg", "Roodepoort",
  "Midrand", "Alexandra", "Tembisa", "Boksburg", "Germiston", "Edenvale",
  "Kempton Park", "Fourways", "Diepkloof", "Orange Farm", "Naturena", "Lenasia",
];

// Rendered once, sitewide (see App.jsx) — describes the business itself,
// not any one page, so it doesn't need to vary per route like <SEO> does.
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mashesha Gas",
  description:
    "Mashesha delivers refilled LPG gas cylinders for cooking and gas heaters straight to your door across Johannesburg.",
  image: "https://mashesha.co.za/og-image.jpg",
  telephone: "+27111234567",
  email: "info@mashesha.co.za",
  url: "https://mashesha.co.za/",
  priceRange: "R",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jeppestown, Johannesburg",
    addressRegion: "Gauteng",
    addressCountry: "ZA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -26.2041,
    longitude: 28.0617,
  },
  areaServed: AREAS_SERVED,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "https://schema.org/PublicHolidays"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
};

function LocalBusinessSchema() {
  return (
    <script type="application/ld+json">
      {JSON.stringify(SCHEMA)}
    </script>
  );
}

export default LocalBusinessSchema;
