import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { products, money } from "../data/products";

function ProductDetails({ addToCart, toggleWish, wishlist = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50">
            <ShoppingBag size={38} className="text-pink-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sorry, this product is not available.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const wished = wishlist.some((p) => p.id === product.id);

  const discount = product.old
    ? Math.round((1 - product.price / product.old) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className="transition hover:text-pink-600"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to={`/category/${encodeURIComponent(product.category)}`}
            className="transition hover:text-pink-600"
          >
            {product.category}
          </Link>

          <span>/</span>

          <span className="max-w-[180px] truncate font-semibold text-pink-600 sm:max-w-xs">
            {product.name}
          </span>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

          {/* PRODUCT IMAGE */}
          <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              <img
                src={product.img}
                alt={product.name}
                className="h-[350px] w-full object-contain p-4 transition duration-500 hover:scale-105 sm:h-[480px]"
              />

              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white shadow-md">
                  {discount}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWish(product)}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${
                  wished ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
                }`}
              >
                <Heart
                  size={22}
                  fill={wished ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={17} className="text-green-600" />
              Quality checked product
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

            <p className="mb-3 w-fit rounded-full bg-pink-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-pink-600">
              {product.category}
            </p>

            <h1 className="text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-bold text-white">
                {product.rating}
                <span>★</span>
              </span>

              <span className="text-sm text-gray-500">
                {product.reviews.toLocaleString("en-IN")} Ratings
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-7 border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {money(product.price)}
                </span>

                {product.old > product.price && (
                  <del className="text-lg text-gray-400">
                    {money(product.old)}
                  </del>
                )}

                {discount > 0 && (
                  <span className="rounded-md bg-green-50 px-3 py-1.5 text-sm font-bold text-green-600">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Inclusive of all taxes
              </p>
            </div>

            {/* DELIVERY INFORMATION */}
            <div className="mt-6 rounded-xl border border-pink-100 bg-pink-50/50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white p-3 text-pink-600 shadow-sm">
                  <Truck size={25} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Free Delivery
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Delivery in 5–7 days
                  </p>
                </div>

                <CheckCircle
                  size={21}
                  className="ml-auto text-green-600"
                />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-7">
              <h3 className="mb-3 font-bold text-gray-900">
                Select Quantity
              </h3>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-12 items-center justify-center text-gray-600 transition hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={17} />
                </button>

                <span className="flex h-11 min-w-12 items-center justify-center border-x border-gray-200 font-bold text-gray-900">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  aria-label="Increase quantity"
                  className="flex h-11 w-12 items-center justify-center text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  addToCart(product, qty);
                  navigate("/cart");
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-4 font-bold text-white shadow-lg shadow-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-700"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWish(product)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 font-bold transition ${
                  wished
                    ? "border-pink-600 bg-pink-50 text-pink-600"
                    : "border-pink-200 bg-white text-pink-600 hover:bg-pink-50"
                }`}
              >
                <Heart
                  size={20}
                  fill={wished ? "currentColor" : "none"}
                />
                {wished ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* PRODUCT BENEFITS */}
            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <ShieldCheck size={23} className="shrink-0 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Secure Payments
                </span>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw size={23} className="shrink-0 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Easy Returns
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Package size={23} className="shrink-0 text-pink-600" />
                <span className="text-sm font-medium text-gray-700">
                  Quality Products
                </span>
              </div>
            </div>

            {/* PRODUCT DESCRIPTION */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Product Details
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                A stylish and comfortable pick for your everyday needs.
                Product colour may slightly vary due to photographic
                lighting sources or monitor settings.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;