import { Link } from "react-router-dom";
import CylinderIcon from "./CylinderIcon";

const CYLINDERS = [
  {
    size: "1kg",
    use: "Portable & camping",
    desc: "Perfect for camping trips, outdoor braais, and single-burner stoves.",
    height: "h-20",
  },
  {
    size: "3kg",
    use: "Small household & backup",
    desc: "Ideal for singles, small apartments, and keeping a backup on hand.",
    height: "h-28",
  },
  {
    size: "12kg",
    use: "Everyday household cooking",
    desc: "Our most popular size — built for daily cooking and water heating.",
    height: "h-40",
  },
  {
    size: "18kg",
    use: "Large family & small business",
    desc: "Steady supply for bigger families, guesthouses, and small eateries.",
    height: "h-48",
  },
];

function Products() {
  return (
    <section id="products" className="bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust">
            Products
          </span>
          <h2 className="font-display mt-4 text-4xl text-cream sm:text-5xl">
            A cylinder for every need.
          </h2>
          <p className="mt-5 text-lg text-cream/70">
            From a single-plate kitchen to a full commercial setup, Mashesha
            keeps the right size gas on tap — refills and swaps available
            across Johannesburg.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CYLINDERS.map((cyl) => (
            <div
              key={cyl.size}
              className="group flex flex-col items-center rounded-2xl border border-cream/10 bg-cream/5 p-7 text-center transition-colors duration-200 hover:border-rust/50 hover:bg-cream/10"
            >
              <div className="flex h-56 items-end">
                <CylinderIcon
                  className={`${cyl.height} w-auto text-rust transition-transform duration-200 group-hover:-translate-y-1`}
                />
              </div>
              <h3 className="font-display mt-6 text-3xl text-cream">{cyl.size}</h3>
              <p className="mt-1 text-sm font-semibold text-rust">{cyl.use}</p>
              <p className="mt-3 text-sm text-cream/65">{cyl.desc}</p>
              <Link
                to={`/products/${cyl.size}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cream transition-colors duration-200 hover:text-rust"
              >
                View details
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
