import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

function Home({ addToCart, cart = [], wishlist = [], toggleWish }) {
  const location = useLocation();

  const [sort, setSort] = useState("default");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);

  // Banner images
  const banners = [
    "/images/image.png",
    "/images/WhatsApp Image 2026-11-05 at 11.08.31 PM (1).jpeg",
    "/images/WhatsApp Image 2026-11-05 at 11.08.31 PM (2).jpeg",
    "/images/WhatsApp Image 2026-11-05 at 11.08.31 PM.jpeg",
  ];

  // Automatic banner slider
  useEffect(() => {
    const slider = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(slider);
  }, []);

  // URL search and category
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
    setFilter(params.get("category") || "all");
  }, [location.search]);

  const isSearching = search.trim().length > 0;

  const categoryEmojis = {
    Women: "👗",
    Men: "👔",
    Kids: "🧒",
    "Kids Wear": "👶",
    Beauty: "💄",
    "Home & Kitchen": "🏠",
    Electronics: "📱",
    Footwear: "👟",
    Accessories: "👜",
    Jewellery: "💍",
    Bags: "🎒",
    Sports: "⚽",
  };

  const getCategoryName = (category) => {
    return typeof category === "string"
      ? category
      : category.name || category.title;
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filter !== "all") {
      result = result.filter(
        (product) =>
          String(product.category || "").toLowerCase() ===
          String(filter).toLowerCase(),
      );
    }

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      result = result.filter((product) => {
        const name = String(product.name || product.title || "").toLowerCase();

        const category = String(product.category || "").toLowerCase();

        return name.includes(searchTerm) || category.includes(searchTerm);
      });
    }

    if (sort === "low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || a.title || "").localeCompare(
          String(b.name || b.title || ""),
        ),
      );
    }

    return result;
  }, [filter, search, sort]);

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setFilter("all");
    setSort("default");
    window.history.replaceState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* HERO BANNER AND BENEFITS */}
      {!isSearching && (
        <>
          {/* AUTOMATIC HERO BANNER SLIDER */}
          <section className="w-full px-2 pt-2 pb-1 sm:px-4 lg:px-5">
            <div className="relative h-[220px] w-full overflow-hidden rounded-xl shadow-sm sm:h-[280px] md:h-[320px] lg:h-[350px] xl:h-[380px]">
              {banners.map((banner, index) => (
                <Link
                  to="/listing"
                  key={banner}
                  className={`absolute inset-0 block transition-opacity duration-1000 ${
                    activeBanner === index
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={banner}
                    alt="Meesho Shopping Banner"
                    className="h-full w-full object-cover"
                  />
                </Link>
              ))}

              {/* SLIDER DOTS */}
              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveBanner(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeBanner === index
                        ? "w-7 bg-white"
                        : "w-2 bg-white/60"
                    }`}
                    aria-label={`Show banner ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* BENEFITS SECTION */}
          <section className="w-full px-2 pt-1 pb-2 sm:px-4 lg:px-5">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-2 shadow-sm sm:p-4">
                <Truck size={20} className="shrink-0 text-pink-600" />
                <span className="text-center text-[10px] font-semibold text-gray-800 sm:text-sm">
                  Free Delivery
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-2 shadow-sm sm:p-4">
                <ShieldCheck size={20} className="shrink-0 text-green-600" />
                <span className="text-center text-[10px] font-semibold text-gray-800 sm:text-sm">
                  Secure Payment
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-2 shadow-sm sm:p-4">
                <RotateCcw size={20} className="shrink-0 text-orange-600" />
                <span className="text-center text-[10px] font-semibold text-gray-800 sm:text-sm">
                  Easy Returns
                </span>
              </div>
            </div>
          </section>

          {/* CATEGORIES SECTION - TAILWIND ANIMATED SLIDER */}
          <section className="w-full overflow-hidden py-5">
            {/* <div className="mb-5 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Shop By Category
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Explore our popular categories
      </p>
    </div>

    <Link
      to="/listing"
      className="flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700"
    >
      View All
      <ArrowRight size={16} />
    </Link>
  </div> */}

            <div className="group w-full overflow-hidden">
              <div className="flex w-max animate-[categorySlide_30s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...categories, ...categories].map((category, index) => {
                  const categoryName = getCategoryName(category);
                  const emoji = categoryEmojis[categoryName] || "🛍️";

                  return (
                    <Link
                      key={`${categoryName}-${index}`}
                      to={`/category/${encodeURIComponent(categoryName)}`}
                      className="mx-2 flex w-32 shrink-0 flex-col items-center rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-40"
                    >
                      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-4xl transition-transform duration-300 group-hover:scale-105">
                        {emoji}
                      </div>

                      <h3 className="text-center text-sm font-semibold text-gray-800 hover:text-pink-600">
                        {categoryName}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PRODUCTS / SEARCH RESULTS SECTION */}
      <section
        className={`w-full px-3 sm:px-5 lg:px-6 ${
          isSearching ? "pt-5 pb-10" : "py-6"
        }`}
      >
        {/* SEARCH RESULT HEADING */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSearching
                ? `Results for "${search}"`
                : filter !== "all"
                  ? filter
                  : "Popular Products"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products available
            </p>
          </div>

          {isSearching ? (
            <button
              onClick={clearSearch}
              className="rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              Clear Search ✕
            </button>
          ) : (
            <Link
              to="/listing"
              className="flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* FILTER AND SORT */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <SlidersHorizontal size={18} />
            Filter & Sort
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500"
            >
              <option value="all">All Categories</option>

              {categories.map((category, index) => {
                const categoryName = getCategoryName(category);

                return (
                  <option key={index} value={categoryName}>
                    {categoryName}
                  </option>
                );
              })}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500"
            >
              <option value="default">Sort By: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {filteredProducts.map((product) => (
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
        ) : (
          <div className="rounded-2xl bg-white px-4 py-16 text-center shadow-sm">
            <div className="mb-3 text-5xl">🛍️</div>

            <h3 className="text-xl font-bold text-gray-800">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try searching with another name or category.
            </p>

            <button
              onClick={clearSearch}
              className="mt-5 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              Show All Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;