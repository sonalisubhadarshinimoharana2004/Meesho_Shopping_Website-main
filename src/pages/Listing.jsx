import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import {
  Home as HomeIcon,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function Listing(props) {
  const { category } = useParams();

  const decoded = decodeURIComponent(category || "");

  const items = products.filter(
    (p) => p.category.toLowerCase() === decoded.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className="flex items-center gap-1 transition hover:text-pink-600"
          >
            <HomeIcon size={16} />
            Home
          </Link>

          <span>/</span>

          <span className="font-semibold text-pink-600">
            {decoded}
          </span>
        </div>

        {/* CATEGORY HEADER */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-orange-100 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-widest text-pink-600 shadow-sm">
                <ShoppingBag size={15} />
                EXPLORE COLLECTION
              </div>

              <h1 className="text-3xl font-extrabold capitalize text-gray-900 sm:text-4xl lg:text-5xl">
                {decoded}
              </h1>

              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                Discover the latest collection at amazing prices.
              </p>

              <p className="mt-2 text-sm font-semibold text-pink-600">
                {items.length} products available
              </p>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-full bg-white/70 text-6xl shadow-sm sm:flex">
              🛍️
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {decoded} Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Fresh styles and fabulous prices, just for you.
              </p>
            </div>

            <span className="w-fit rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
              {items.length} Items
            </span>
          </div>

          {/* PRODUCT GRID */}
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  {...props}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center shadow-sm">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-4xl">
                🛍️
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                More products coming soon!
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                We are adding more amazing products to this collection.
                Please explore our other categories.
              </p>

              <Link
                to="/"
                className="mt-6 flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-pink-700"
              >
                Explore All Products
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Listing;