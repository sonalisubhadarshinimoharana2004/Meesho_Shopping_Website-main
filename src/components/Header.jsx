import { useState } from "react";
import {
  Search,
  UserRound,
  ShoppingCart,
  Heart,
  Menu,
  X,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { categories } from "../data/products";

function Header({
  cart = [],
  wishlist = [],
  user,
  onProfileClick,
}) {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const hideCategories = [
    "/login",
    "/register",
  ].includes(location.pathname);

  const currentCategory = decodeURIComponent(
    location.pathname.split("/")[2] || ""
  ).trim().toLowerCase();

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.qty || 0),
    0
  );

  const wishlistCount = wishlist.length;

  const submit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ${
      isActive
        ? "text-pink-600"
        : "text-gray-700 hover:text-pink-600"
    }`;

  const getCategoryClass = (category) => {
    const isActive =
      currentCategory === category.trim().toLowerCase();

    return `relative flex h-full items-center whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "border-pink-600 text-pink-600 font-bold"
        : "border-transparent text-gray-700 hover:border-pink-600 hover:text-pink-600"
    }`;
  };

  const getMobileCategoryClass = (category) => {
    const isActive =
      currentCategory === category.trim().toLowerCase();

    return `rounded-lg px-3 py-2 text-sm font-medium transition-all ${
      isActive
        ? "bg-pink-50 text-pink-600 font-bold border border-pink-200"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
    }`;
  };

  const openProfile = () => {
    setMobileOpen(false);
    onProfileClick?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">

      {/* MAIN NAVBAR */}
      <div className="w-full px-3 sm:px-5 lg:px-8 xl:px-10">

        <div className="flex min-h-20 w-full items-center justify-between gap-3 lg:gap-6">

          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0 text-3xl font-extrabold tracking-tight text-pink-600 md:text-4xl"
          >
            meesho<span className="text-purple-600">.</span>
          </Link>

          {/* DESKTOP SEARCH */}
          <form
            onSubmit={submit}
            className="hidden h-12 min-w-0 max-w-none flex-1 items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 transition-all focus-within:border-pink-500 focus-within:bg-white md:flex"
          >
            <Search
              size={21}
              className="shrink-0 text-gray-500"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try Saree, Kurti or Search Product"
              className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 text-gray-500 hover:text-pink-600"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* DESKTOP ACTIONS */}
          <div className="hidden shrink-0 items-center gap-5 xl:gap-8 lg:flex">

            <button
              type="button"
              onClick={openProfile}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-700 transition-colors hover:text-pink-600"
            >
              <UserRound size={22} />
              <span>
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
            </button>

            <NavLink
              to="/wishlist"
              className={navLinkClass}
            >
              <span className="relative">
                <Heart size={22} />

                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </span>

              <span>Wishlist</span>
            </NavLink>

            <NavLink
              to="/cart"
              className={navLinkClass}
            >
              <span className="relative">
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </span>

              <span>Cart</span>
            </NavLink>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="shrink-0 rounded-lg p-2 text-gray-700 transition-colors hover:bg-pink-50 hover:text-pink-600 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>

        </div>

        {/* MOBILE SEARCH */}
        <form
          onSubmit={submit}
          className="mb-3 flex h-11 w-full items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 focus-within:border-pink-500 md:hidden"
        >
          <Search
            size={19}
            className="shrink-0 text-gray-500"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full min-w-0 bg-transparent text-sm outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </form>

      </div>

      {/* DESKTOP CATEGORY NAVIGATION */}
      {!hideCategories && (
        <nav className="hidden w-full border-t border-gray-100 lg:block">

          <div className="flex w-full items-center justify-between gap-4 overflow-x-auto px-4 xl:px-8">

            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                className={getCategoryClass(category)}
              >
                {category}
              </Link>
            ))}

          </div>
        </nav>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg lg:hidden">

          <div className="space-y-5 px-5 py-5">

            <button
              type="button"
              onClick={openProfile}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-pink-600"
            >
              <UserRound size={21} />

              {user?.name?.split(" ")[0] || "Profile"}
            </button>

            <NavLink
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              <Heart size={21} />
              Wishlist ({wishlistCount})
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              <ShoppingCart size={21} />
              Cart ({cartCount})
            </NavLink>

            {!hideCategories && (
              <div className="border-t border-gray-200 pt-4">

                <h3 className="mb-4 font-bold text-gray-900">
                  Shop By Category
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${encodeURIComponent(category)}`}
                      onClick={() => setMobileOpen(false)}
                      className={getMobileCategoryClass(category)}
                    >
                      {category}
                    </Link>
                  ))}

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
}

export default Header;