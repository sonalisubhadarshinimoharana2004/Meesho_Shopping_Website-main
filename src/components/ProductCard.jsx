import { useEffect, useState } from "react";
import { Heart, Star, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../data/products";

function ProductCard({
  product,
  addToCart,
  cart = [],
  wishlist = [],
  toggleWish,
}) {
  const navigate = useNavigate();

  const wished = wishlist.some(
    (item) => String(item.id) === String(product.id)
  );

  const alreadyInCart = cart.some(
    (item) => String(item.id) === String(product.id)
  );

  const [justAdded, setJustAdded] = useState(alreadyInCart);

  useEffect(() => {
    setJustAdded(alreadyInCart);
  }, [alreadyInCart]);

  const isInCart = alreadyInCart || justAdded;

  const discount =
    product.old > product.price
      ? Math.round((1 - product.price / product.old) * 100)
      : 0;

  const handleCartClick = () => {
    if (isInCart) {
      navigate("/cart");
      return;
    }

    addToCart(product);
    setJustAdded(true);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}
      <div className="relative shrink-0 overflow-hidden bg-gray-100">
        <Link
          to={`/product/${product.id}`}
          className="block aspect-[4/4.5] overflow-hidden"
        >
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Product Tag */}
        {product.tag && (
          <span className="absolute left-2 top-2 max-w-[75%] truncate rounded-full bg-pink-600 px-2 py-1 text-[10px] font-semibold text-white shadow sm:text-xs">
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWish(product)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all ${
            wished
              ? "bg-pink-600 text-white"
              : "bg-white/95 text-gray-600 hover:bg-pink-600 hover:text-white"
          }`}
        >
          <Heart
            size={16}
            fill={wished ? "currentColor" : "none"}
          />
        </button>

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute bottom-2 left-2 rounded bg-green-600 px-2 py-1 text-[10px] font-bold text-white sm:text-xs">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-2 sm:p-3">

        {/* Product Name */}
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 min-h-[2.4rem] text-xs font-medium leading-5 text-gray-800 transition-colors hover:text-pink-600 sm:text-sm"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-1.5 flex min-h-6 flex-wrap items-center gap-x-1.5">
          <span className="text-sm font-bold text-gray-900 sm:text-base">
            {money(product.price)}
          </span>

          {product.old > product.price && (
            <del className="text-[10px] text-gray-400 sm:text-xs">
              {money(product.old)}
            </del>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex shrink-0 items-center gap-1 rounded bg-green-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {product.rating}
            <Star size={10} fill="currentColor" />
          </span>

          <span className="truncate text-[10px] text-gray-500 sm:text-xs">
            {product.reviews.toLocaleString("en-IN")} reviews
          </span>
        </div>

        {/* Delivery */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-green-700 sm:text-xs">
          <Truck size={13} className="shrink-0" />
          <span>Free Delivery</span>
        </div>

        {/* Cart Button */}
        <button
          type="button"
          onClick={handleCartClick}
          className={`mt-3 h-9 w-full shrink-0 rounded-lg border px-2 text-[11px] font-semibold transition-all duration-200 active:scale-95 sm:h-10 sm:text-xs ${
            isInCart
              ? "border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600"
              : "border-pink-600 bg-pink-600 text-white hover:bg-white hover:text-pink-600"
          }`}
        >
          {isInCart ? "Go to Cart" : "Add to Cart"}
        </button>

      </div>
    </article>
  );
}

export default ProductCard;