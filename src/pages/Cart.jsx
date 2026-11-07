import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Tag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

import { money } from "../data/products";

function Cart({ cart = [], changeQty, removeCart }) {
  const navigate = useNavigate();

  const [showCoupons, setShowCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // AVAILABLE COUPONS
  const coupons = [
    {
      code: "WELCOME10",
      discount: 10,
      min: 500,
      max: 699,
    },
    {
      code: "MEESHO15",
      discount: 15,
      min: 700,
      max: 999,
    },
    {
      code: "DIWALI20",
      discount: 20,
      min: 1000,
      max: Infinity,
    },
  ];

  // ORIGINAL PRICE
  const originalSubtotal = cart.reduce((sum, product) => {
    const price = Number(product.price || 0);
    const oldPrice = Number(product.old || price);

    return (
      sum +
      Math.max(oldPrice, price) * Number(product.qty || 0)
    );
  }, 0);

  // SELLING PRICE
  const subtotal = cart.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) * Number(product.qty || 0),
    0
  );

  // PRODUCT DISCOUNT
  const productDiscount = originalSubtotal - subtotal;

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (sum, product) => sum + Number(product.qty || 0),
    0
  );

  // SELECTED COUPON
  const selectedCoupon = coupons.find(
    (coupon) => coupon.code === appliedCoupon
  );

  // CHECK ELIGIBILITY
  const isCouponEligible =
    selectedCoupon &&
    subtotal >= selectedCoupon.min &&
    subtotal <= selectedCoupon.max;

  // COUPON DISCOUNT
  const couponDiscount = isCouponEligible
    ? Math.round(
        (subtotal * selectedCoupon.discount) / 100
      )
    : 0;

  // FINAL AMOUNT
  const totalAmount = subtotal - couponDiscount;

  // REMOVE COUPON
  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setShowCoupons(true);
  };

  // CHECKOUT
  const handleCheckout = () => {
    if (!cart.length) return;

    navigate("/order", {
      state: {
        cart,
        couponCode: isCouponEligible ? appliedCoupon : "",
        couponDiscount,
        subtotal,
        totalAmount,
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* PAGE HEADING */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-pink-600">
            YOUR SHOPPING BAG
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Cart{" "}
            <span className="text-lg font-medium text-gray-500">
              ({totalItems} items)
            </span>
          </h1>
        </div>

        {!cart.length ? (
          /* EMPTY CART */
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <ShoppingCart
                size={42}
                className="text-pink-600"
              />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mb-7 text-gray-500">
              Looks like you haven't added anything yet.
              Start shopping now!
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-pink-700"
            >
              <ShoppingBag size={19} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* CART CONTENT */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* CART PRODUCTS */}
            <div className="space-y-5 lg:col-span-2">

              {cart.map((product) => {
                const price = Number(product.price || 0);
                const oldPrice = Number(product.old || price);

                const hasDiscount = oldPrice > price;

                const discountPercent = hasDiscount
                  ? Math.round(
                      ((oldPrice - price) / oldPrice) * 100
                    )
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:p-5"
                  >
                    {/* PRODUCT IMAGE */}
                    <Link
                      to={`/product/${product.id}`}
                      className="shrink-0"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="h-44 w-full rounded-lg bg-gray-100 object-cover sm:h-40 sm:w-36"
                      />
                    </Link>

                    {/* PRODUCT DETAILS */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <Link
                            to={`/product/${product.id}`}
                            className="text-lg font-semibold text-gray-900 transition-colors hover:text-pink-600"
                          >
                            {product.name}
                          </Link>

                          <p className="mt-2 text-sm text-gray-500">
                            {product.category}
                          </p>
                        </div>

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() => removeCart(product.id)}
                          className="flex h-fit items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-red-600"
                        >
                          <Trash2 size={17} />
                          <span className="hidden sm:inline">
                            Remove
                          </span>
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <strong className="text-xl font-bold text-gray-900">
                          {money(price)}
                        </strong>

                        {hasDiscount && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              {money(oldPrice)}
                            </span>

                            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                              {discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* QUANTITY */}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              changeQty(product.id, -1)
                            }
                            disabled={product.qty <= 1}
                            className="flex h-9 w-10 items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-12 text-center font-semibold text-gray-900">
                            {product.qty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQty(product.id, 1)
                            }
                            className="flex h-9 w-10 items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                          Total: {money(price * product.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CONTINUE SHOPPING */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-semibold text-pink-600 transition-colors hover:text-pink-700"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>

            {/* PRICE SUMMARY */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Price Details
                </h2>

                {/* APPLY COUPON */}
                <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">

                  {/* COUPON HEADER */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowCoupons(!showCoupons)
                    }
                    className="flex w-full items-center justify-between p-4 text-left transition hover:bg-pink-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                        <Tag
                          size={21}
                          className="text-pink-600"
                        />
                      </div>

                      <div>
                        {isCouponEligible ? (
                          <>
                            <p className="font-bold text-green-700">
                              Coupon Applied
                            </p>

                            <p className="text-xs font-bold text-pink-600">
                              {appliedCoupon}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-gray-900">
                              Apply Coupon
                            </p>

                            <p className="text-xs text-gray-500">
                              Save more on your order
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {showCoupons ? (
                      <ChevronUp
                        size={20}
                        className="text-gray-500"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="text-gray-500"
                      />
                    )}
                  </button>

                  {/* COUPON OPTIONS */}
                  {showCoupons && (
                    <div className="space-y-3 border-t border-gray-100 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Available Offers
                      </p>

                      {coupons.map((coupon) => {
                        const eligible =
                          subtotal >= coupon.min &&
                          subtotal <= coupon.max;

                        const remaining = Math.max(
                          0,
                          coupon.min - subtotal
                        );

                        const isApplied =
                          appliedCoupon === coupon.code &&
                          eligible;

                        return (
                          <div
                            key={coupon.code}
                            className={`rounded-lg border p-3 transition ${
                              isApplied
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            {/* COUPON DETAILS */}
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="font-extrabold text-pink-600">
                                  {coupon.code}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Get {coupon.discount}% OFF
                                </p>
                              </div>

                              <span className="rounded bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                                {coupon.discount}% OFF
                              </span>
                            </div>

                            {/* OFFER RANGE */}
                            <p className="mt-2 text-xs text-gray-500">
                              {coupon.min === 1000
                                ? "On purchases of ₹1000 and above"
                                : `On purchases between ${money(coupon.min)} and ${money(coupon.max)}`}
                            </p>

                            {/* APPLY BUTTON */}
                            <div className="mt-3 flex items-center justify-between gap-2">
                              {!eligible ? (
                                <p className="text-xs font-semibold text-orange-600">
                                  Add {money(remaining)} more
                                </p>
                              ) : isApplied ? (
                                <p className="flex items-center gap-1 text-xs font-bold text-green-700">
                                  <CheckCircle2 size={15} />
                                  Coupon Applied
                                </p>
                              ) : (
                                <p className="text-xs font-semibold text-green-600">
                                  Available for your cart
                                </p>
                              )}

                              <button
                                type="button"
                                disabled={!eligible || isApplied}
                                onClick={() => {
                                  setAppliedCoupon(coupon.code);
                                  setShowCoupons(false);
                                }}
                                className={`rounded-md px-5 py-2 text-xs font-bold transition ${
                                  eligible && !isApplied
                                    ? "bg-pink-600 text-white hover:bg-pink-700"
                                    : "cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-400"
                                }`}
                              >
                                {isApplied ? "Applied" : "Apply"}
                              </button>
                            </div>

                            {/* LOCKED OFFER MESSAGE */}
                            {!eligible && (
                              <p className="mt-1 text-[11px] text-orange-500">
                                Add products worth {money(remaining)} to your cart.
                              </p>
                            )}

                            {/* REMOVE APPLIED COUPON */}
                            {isApplied && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  type="button"
                                  onClick={handleRemoveCoupon}
                                  className="text-xs font-bold text-red-500 hover:text-red-700"
                                >
                                  Remove Coupon
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PRICE DETAILS */}
                <div className="space-y-5">

                  {/* ORIGINAL PRICE */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price ({totalItems} items)</span>

                    <span className="font-semibold text-gray-900">
                      {money(originalSubtotal)}
                    </span>
                  </div>

                  {/* PRODUCT DISCOUNT */}
                  {productDiscount > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Product Discount</span>

                      <span className="font-semibold text-green-600">
                        - {money(productDiscount)}
                      </span>
                    </div>
                  )}

                  {/* DELIVERY */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charges</span>

                    <span className="font-semibold text-green-600">
                      FREE
                    </span>
                  </div>

                  {/* COUPON DISCOUNT */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Coupon Discount

                      {isCouponEligible && (
                        <span className="ml-1 text-xs text-green-600">
                          ({appliedCoupon})
                        </span>
                      )}
                    </span>

                    <span className="font-semibold text-green-600">
                      - {money(couponDiscount)}
                    </span>
                  </div>

                  {/* FINAL AMOUNT */}
                  <div className="border-t border-dashed border-gray-300 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        Total Amount
                      </span>

                      <span className="text-2xl font-extrabold text-pink-600">
                        {money(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* TOTAL SAVINGS */}
                  {productDiscount + couponDiscount > 0 && (
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                      <p className="text-sm font-bold text-green-700">
                        Yay! You saved{" "}
                        {money(productDiscount + couponDiscount)}!
                      </p>
                    </div>
                  )}
                </div>

                {/* CHECKOUT */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-7 w-full rounded-lg bg-pink-600 py-3.5 font-bold text-white shadow-md shadow-pink-100 transition-all hover:bg-pink-700 active:scale-[0.98]"
                >
                  Continue to Payment →
                </button>

                {/* SECURITY */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck
                    size={17}
                    className="text-green-600"
                  />
                  Safe and secure checkout
                </div>

                {/* DELIVERY INFORMATION */}
                <div className="mt-6 flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Truck
                    size={22}
                    className="text-green-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Free Delivery
                    </p>

                    <p className="text-xs text-green-700">
                      Enjoy free delivery on your order.
                    </p>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;