import { Link } from "react-router-dom";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import ProductCard from "../components/ProductCard";

function Wishlist({
  wishlist = [],
  cart = [],
  addToCart,
  toggleWish,
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100 via-rose-50 to-orange-100 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-widest text-pink-600 shadow-sm">
                <Sparkles size={15} />
                SAVED FOR LATER
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
                All your favourite products in one place.
                Save the products you love and shop whenever you want.
              </p>

              <p className="mt-3 text-sm font-bold text-pink-600">
                {wishlist.length} saved{" "}
                {wishlist.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-full bg-white/70 text-pink-600 shadow-sm sm:flex">
              <Heart size={55} fill="currentColor" />
            </div>
          </div>
        </section>

        {/* WISHLIST PRODUCTS */}
        {wishlist.length > 0 ? (
          <section>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Your Favourite Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Products you've saved for later.
                </p>
              </div>

              <Link
                to="/"
                className="flex w-fit items-center gap-2 text-sm font-bold text-pink-600 transition hover:text-pink-700"
              >
                Continue Shopping
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  cart={cart}
                  wishlist={wishlist}
                  toggleWish={toggleWish}
                />
              ))}
            </div>
          </section>
        ) : (
          /* EMPTY WISHLIST */
          <section className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-pink-50">
              <Heart
                size={55}
                className="text-pink-500"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Your wishlist is waiting!
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
              You haven't saved any products yet.
              Explore our collection and add your favourite products
              to your wishlist.
            </p>

            <Link
              to="/"
              className="mt-7 flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-700"
            >
              <ShoppingBag size={19} />
              Explore Products
              <ArrowRight size={18} />
            </Link>

            <p className="mt-6 text-xs text-gray-400">
              Your favourite styles are just one click away!
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default Wishlist;