import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { money } from "../data/products";

function Order({ cart = [], removeCart }) {
  const location = useLocation();
  const navigate = useNavigate();

  const orderItems = location.state?.cart || cart;

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("meesho_user")) || null;
    } catch {
      return null;
    }
  });

  const emailKey = currentUser?.email?.trim().toLowerCase() || "";

  const isLoggedIn = Boolean(currentUser && emailKey);

  const storageKey = isLoggedIn
    ? `addressBook_${emailKey}`
    : "addressBook_guest";

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch {
        return [];
      }
    })();

    return (
      saved.find((address) => address.isDefault)?.id || saved[0]?.id || null
    );
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [payment, setPayment] = useState("COD");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState("");

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "Odisha",
  });

  // SCROLL TO TOP WHEN ORDER CONFIRMATION APPEARS
  useEffect(() => {
    if (confirmedOrder) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [confirmedOrder]);

  // NORMALIZE ADDRESS FORMAT
  // Supports both Order address format and Profile address format.
  const normalizeAddress = (address) => {
    if (!address) return null;

    const fullAddress = address.address || address.area || "";

    const landmark = address.landmark ? `, Near ${address.landmark}` : "";

    return {
      ...address,
      name: address.name || address.fullName || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      address: `${fullAddress}${landmark}`,
      city: address.city || "",
      state: address.state || "",
    };
  };

  const subtotal = Number.isFinite(location.state?.subtotal)
    ? location.state.subtotal
    : orderItems.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.qty || 1),
        0,
      );

  const couponCode = location.state?.couponCode || "";

  const couponRules = {
    WELCOME10: {
      discount: 10,
      min: 500,
      max: 699,
    },
    MEESHO15: {
      discount: 15,
      min: 700,
      max: 999,
    },
    DIWALI20: {
      discount: 20,
      min: 999,
      max: Infinity,
    },
  };

  const selectedCoupon = couponRules[couponCode];

  const isCouponEligible =
    selectedCoupon &&
    subtotal >= selectedCoupon.min &&
    subtotal <= selectedCoupon.max;

  const calculatedDiscount = isCouponEligible
    ? Math.round((subtotal * selectedCoupon.discount) / 100)
    : 0;

  const discount = isCouponEligible
    ? Number.isFinite(location.state?.couponDiscount)
      ? location.state.couponDiscount
      : calculatedDiscount
    : 0;

  const delivery = subtotal >= 499 ? 0 : 40;

  const totalAmount = Math.max(0, subtotal - discount + delivery);

  // UPDATE ADDRESS STORAGE
  const updateAddressStorage = (updatedAddresses) => {
    setAddresses(updatedAddresses);

    localStorage.setItem(storageKey, JSON.stringify(updatedAddresses));
  };

  // ADDRESS INPUT CHANGE
  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // SAVE NEW ADDRESS
  const saveAddress = () => {
    if (!newAddress.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(newAddress.phone)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      setError("Please enter a valid 6 digit pincode.");
      return;
    }

    if (
      !newAddress.address.trim() ||
      !newAddress.city.trim() ||
      !newAddress.state.trim()
    ) {
      setError("Please fill all address details.");
      return;
    }

    const address = {
      ...newAddress,
      id: Date.now(),
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, address];

    updateAddressStorage(updatedAddresses);

    setSelectedAddress(address.id);
    setShowAddressForm(false);
    setError("");

    setNewAddress({
      name: "",
      phone: "",
      pincode: "",
      address: "",
      city: "",
      state: "Odisha",
    });
  };

  // DELETE ADDRESS
  const deleteAddress = (id) => {
    let updatedAddresses = addresses.filter((address) => address.id !== id);

    if (
      updatedAddresses.length > 0 &&
      !updatedAddresses.some((address) => address.isDefault)
    ) {
      updatedAddresses = updatedAddresses.map((address, index) => ({
        ...address,
        isDefault: index === 0,
      }));
    }

    updateAddressStorage(updatedAddresses);

    if (selectedAddress === id) {
      setSelectedAddress(
        updatedAddresses.find((address) => address.isDefault)?.id ||
          updatedAddresses[0]?.id ||
          null,
      );
    }
  };

  // PLACE ORDER
  const placeOrder = () => {
    // IMPORTANT: LOGIN REQUIRED
    if (!isLoggedIn) {
      setError("Please login first to place your order.");

      navigate("/login", {
        state: {
          from: "/order",
        },
      });

      return;
    }

    if (!orderItems.length) {
      setError("Your cart is empty.");
      return;
    }

    const selectedAddressData = addresses.find(
      (item) => item.id === selectedAddress,
    );

    if (!selectedAddressData) {
      setError("Please select or add a delivery address.");
      return;
    }

    const address = normalizeAddress(selectedAddressData);

    const orderId = `MS${Date.now().toString().slice(-10)}`;

    const order = {
      orderId,
      items: orderItems,
      address,
      payment,
      subtotal,
      couponCode: isCouponEligible ? couponCode : "",
      discount,
      delivery,
      total: totalAmount,
      date: new Date().toISOString(),
      status: "Placed",
    };

    // SAVE ONLY TO LOGGED-IN USER'S ORDERS
    const orderStorageKey = `myOrders_${emailKey}`;

    try {
      const previousOrders = JSON.parse(
        localStorage.getItem(orderStorageKey) || "[]",
      );

      localStorage.setItem(
        orderStorageKey,
        JSON.stringify([order, ...previousOrders]),
      );
    } catch (error) {
      console.error("Order save error:", error);

      setError("Could not save your order. Please try again.");
      return;
    }

    // REMOVE PURCHASED ITEMS FROM CART
    orderItems.forEach((item) => {
      removeCart?.(item.id);
    });

    setConfirmedOrder(order);
    setError("");
  };

  // ORDER CONFIRMATION PAGE
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 px-4 py-10">
        <style>{`
          @keyframes successPop {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            60% {
              transform: scale(1.15);
              opacity: 1;
            }
            80% {
              transform: scale(0.92);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes drawTick {
            0% {
              stroke-dashoffset: 50;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes successFade {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .success-circle {
            animation: successPop 0.65s ease-out both;
          }

          .success-tick {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: drawTick 0.45s ease-out 0.5s forwards;
          }

          .success-content {
            animation: successFade 0.7s ease-out 0.35s both;
          }

          @media (prefers-reduced-motion: reduce) {
            .success-circle,
            .success-tick,
            .success-content {
              animation: none;
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
        `}</style>

        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 text-center shadow-lg sm:p-10">
          {/* SUCCESS TICK */}
          <div className="success-circle mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-md shadow-green-100">
            <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none">
              <circle cx="26" cy="26" r="24" stroke="#16a34a" strokeWidth="2" />

              <path
                className="success-tick"
                d="M14 27 L22 35 L39 17"
                stroke="#16a34a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="success-content">
            <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-700">
              Order Confirmed
            </span>

            <h1 className="mt-4 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Order Placed Successfully!
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Thank you for shopping with Meesho. Your order has been placed
              successfully.
            </p>

            {/* ORDER SUMMARY */}
            <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left">
              <div className="flex justify-between gap-3 border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-500">Order ID</span>

                <span className="text-sm font-bold text-gray-900">
                  {confirmedOrder.orderId}
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-gray-200 py-4">
                <span className="text-sm text-gray-500">Payment Method</span>

                <span className="text-sm font-bold text-gray-900">
                  {confirmedOrder.payment === "COD"
                    ? "Cash on Delivery"
                    : confirmedOrder.payment === "UPI"
                      ? "UPI"
                      : "Credit / Debit Card"}
                </span>
              </div>

              <div className="flex justify-between gap-3 py-3">
                <span className="text-sm text-gray-500">
                  Product Total Price
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {money(confirmedOrder.subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-3 py-3">
                <span className="text-sm text-gray-500">Delivery Charges</span>

                <span className="text-sm font-semibold text-green-600">
                  {confirmedOrder.delivery === 0
                    ? "FREE"
                    : money(confirmedOrder.delivery)}
                </span>
              </div>

              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between gap-3 border-b border-gray-200 py-3">
                  <span className="text-sm text-gray-500">Coupon Discount</span>

                  <span className="text-sm font-bold text-green-600">
                    - {money(confirmedOrder.discount)}
                  </span>
                </div>
              )}

              <div className="mt-3 flex justify-between gap-3 border-t border-gray-200 pt-4">
                <span className="font-bold text-gray-900">Final Price</span>

                <span className="text-2xl font-extrabold text-pink-600">
                  {money(confirmedOrder.total)}
                </span>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="mt-5 rounded-2xl border border-gray-200 p-5 text-left">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                <MapPin size={19} className="text-pink-600" />
                Delivery Address
              </h3>

              <p className="text-sm font-bold text-gray-900">
                {confirmedOrder.address.name}
              </p>

              <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                {confirmedOrder.address.address}, {confirmedOrder.address.city},{" "}
                {confirmedOrder.address.state} -{" "}
                {confirmedOrder.address.pincode}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Mobile: {confirmedOrder.address.phone}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <button
              onClick={() => navigate("/my-orders")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 font-bold text-white shadow-md transition hover:bg-pink-700"
            >
              <Package size={19} />
              My Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-3 w-full rounded-xl border-2 border-pink-600 py-3.5 font-bold text-pink-600 transition hover:bg-pink-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT PAGE
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="mb-7 text-2xl font-extrabold text-gray-900">Checkout</h1>

        {!isLoggedIn && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="font-bold text-orange-700">Login Required</p>

            <p className="mt-1 text-sm text-orange-600">
              Please login to your account before placing an order.
            </p>

            <button
              onClick={() =>
                navigate("/login", {
                  state: { from: "/order" },
                })
              }
              className="mt-3 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
            >
              Login Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2">
            {/* ADDRESS SECTION */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <MapPin className="text-pink-600" />
                  Delivery Address
                </h2>

                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-sm font-bold text-pink-600"
                >
                  <Plus size={17} />
                  Add New
                </button>
              </div>

              {addresses.length === 0 && !showAddressForm && (
                <div className="rounded-xl bg-gray-50 p-6 text-center">
                  <MapPin size={35} className="mx-auto mb-3 text-gray-400" />

                  <p className="text-sm text-gray-500">
                    No saved address found.
                  </p>

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-3 rounded-lg bg-pink-600 px-5 py-2 text-sm font-bold text-white"
                  >
                    Add Address
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {addresses.map((savedAddress) => {
                  const address = normalizeAddress(savedAddress);

                  return (
                    <div
                      key={savedAddress.id}
                      onClick={() => setSelectedAddress(savedAddress.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        selectedAddress === savedAddress.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={selectedAddress === savedAddress.id}
                          onChange={() => setSelectedAddress(savedAddress.id)}
                          className="mt-1 accent-pink-600"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="break-words font-bold text-gray-900">
                              {address.name}
                            </span>

                            {savedAddress.isDefault && (
                              <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-words text-sm leading-6 text-gray-600">
                            {address.address}, {address.city}, {address.state} -{" "}
                            {address.pincode}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Phone: {address.phone}
                          </p>
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteAddress(savedAddress.id);
                          }}
                          className="shrink-0 text-gray-400 hover:text-red-500"
                          title="Delete address"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NEW ADDRESS FORM */}
              {showAddressForm && (
                <div className="mt-5 rounded-xl border border-gray-200 p-4">
                  <h3 className="mb-4 font-bold text-gray-900">
                    Add Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.name}
                      onChange={(e) =>
                        handleAddressChange("name", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500"
                    />

                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      value={newAddress.phone}
                      onChange={(e) =>
                        handleAddressChange(
                          "phone",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500"
                    />

                    <input
                      type="text"
                      placeholder="Pincode"
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={(e) =>
                        handleAddressChange(
                          "pincode",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500"
                    />

                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500"
                    />

                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500 sm:col-span-2"
                    />

                    <textarea
                      placeholder="House No, Street, Area, Landmark"
                      rows={3}
                      value={newAddress.address}
                      onChange={(e) =>
                        handleAddressChange("address", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pink-500 sm:col-span-2"
                    />
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={saveAddress}
                      className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
                    >
                      Save Address
                    </button>

                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        setError("");
                      }}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT SECTION */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                <CreditCard className="text-pink-600" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: "COD",
                    title: "Cash on Delivery",
                    description: "Pay when your order arrives",
                  },
                  {
                    id: "UPI",
                    title: "UPI",
                    description: "Google Pay, PhonePe, Paytm",
                  },
                  {
                    id: "CARD",
                    title: "Credit / Debit Card",
                    description: "Visa, Mastercard and more",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      payment === method.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment === method.id}
                      onChange={() => setPayment(method.id)}
                      className="accent-pink-600"
                    />

                    <div>
                      <p className="font-bold text-gray-900">{method.title}</p>

                      <p className="mt-1 text-xs text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <ShieldCheck size={18} />
                Your order information is secure.
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            {/* PRODUCTS */}
            <div className="mb-5 space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.qty || 1}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {money(item.price * (item.qty || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-gray-500">Product Total Price</span>

                <span className="font-semibold text-gray-900">
                  {money(subtotal)}
                </span>
              </div>

              <div className="mb-3 flex justify-between text-sm">
                <span className="text-gray-500">Delivery Charges</span>

                <span className="font-semibold text-green-600">
                  {delivery === 0 ? "FREE" : money(delivery)}
                </span>
              </div>

              {discount > 0 && (
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-gray-500">Coupon Discount</span>

                  <span className="font-semibold text-green-600">
                    - {money(discount)}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                <span className="font-bold text-gray-900">Final Price</span>

                <span className="text-xl font-extrabold text-pink-600">
                  {money(totalAmount)}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={placeOrder}
              disabled={!orderItems.length}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Package size={18} />
              {isLoggedIn ? "Place Order" : "Login to Place Order"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Safe and secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;