import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Printer,
  MapPin,
  CreditCard,
} from "lucide-react";

function MyOrder() {
  const [orders] = useState(() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("meesho_user") || "{}",
      );

      if (!currentUser.email) return [];

      const userOrdersKey = `myOrders_${currentUser.email
        .trim()
        .toLowerCase()}`;

      const userOrders = JSON.parse(
        localStorage.getItem(userOrdersKey) || "[]",
      );

      return Array.isArray(userOrders) ? userOrders : [];
    } catch {
      return [];
    }
  });

  const [expandedOrder, setExpandedOrder] = useState(null);

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

  const getQty = (item) => Number(item.quantity || item.qty || 1);

  const getSubtotal = (order) => {
    if (Number.isFinite(Number(order.subtotal))) {
      return Number(order.subtotal);
    }

    return (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * getQty(item),
      0,
    );
  };

  const getDiscount = (order) => Number(order.discount || 0);

  const getDelivery = (order) => Number(order.delivery || 0);

  const getOrderTotal = (order) => {
    if (Number.isFinite(Number(order.total))) {
      return Number(order.total);
    }

    return getSubtotal(order) - getDiscount(order) + getDelivery(order);
  };

  const getPaymentName = (payment) => {
    if (payment === "COD") return "Cash on Delivery";
    if (payment === "UPI") return "UPI";
    if (payment === "CARD") return "Credit / Debit Card";

    return payment || "Cash on Delivery";
  };

  const getFullAddress = (address) => {
    if (!address) return "Address not available";

    return [
      address.address || address.fullAddress,
      address.city,
      address.state,
      address.pincode ? `PIN: ${address.pincode}` : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  const toggleOrder = (id) => {
    setExpandedOrder((previous) => (previous === id ? null : id));
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  // ==========================================
  // DOWNLOAD / PRINT INVOICE
  // ==========================================
  const printInvoice = (order) => {
    const billingAddress = {
      name: order.billingAddress?.name || order.address?.name || "Customer",

      address:
        order.billingAddress?.address ||
        order.billingAddress?.fullAddress ||
        order.address?.address ||
        order.address?.fullAddress ||
        "",

      city: order.billingAddress?.city || order.address?.city || "",

      state: order.billingAddress?.state || order.address?.state || "",

      pincode: order.billingAddress?.pincode || order.address?.pincode || "",

      phone: order.billingAddress?.phone || order.address?.phone || "",
    };

    const deliveryAddress = order.address || {};

    const subtotal = getSubtotal(order);
    const discount = getDiscount(order);
    const delivery = getDelivery(order);
    const finalTotal = getOrderTotal(order);

    const orderDate = order.date
      ? new Date(order.date).toLocaleDateString("en-IN")
      : "N/A";

    const addressDetails = (address) => {
      return [
        address.address || address.fullAddress,
        address.city,
        address.state,
        address.pincode ? `PIN: ${address.pincode}` : "",
        address.phone ? `Mobile: ${address.phone}` : "",
      ]
        .filter(Boolean)
        .map(escapeHTML)
        .join("<br/>");
    };

    const productsHTML = (order.items || [])
      .map((item, index) => {
        const qty = getQty(item);
        const price = Number(item.price || 0);

        return `
          <tr class="break-inside-avoid">
            <td class="border border-gray-300 px-3 py-2 text-center">
              ${index + 1}
            </td>

            <td class="border border-gray-300 px-3 py-2">
              ${escapeHTML(item.name || "Product")}
            </td>

            <td class="border border-gray-300 px-3 py-2 text-center">
              ${qty}
            </td>

            <td class="border border-gray-300 px-3 py-2 text-right">
              ₹${formatPrice(price)}
            </td>

            <td class="border border-gray-300 px-3 py-2 text-right">
              ₹${formatPrice(price * qty)}
            </td>
          </tr>
        `;
      })
      .join("");

    const invoiceHTML = `
      <div class="w-full bg-white p-2 text-gray-800">

        <!-- HEADER -->
        <div class="mb-5 flex items-start justify-between border-b-2 border-pink-600 pb-4">
          <div>
            <h1 class="text-3xl font-extrabold text-pink-600">
              Meesho
            </h1>

            <p class="mt-1 text-xs text-gray-500">
              Shopping Invoice
            </p>
          </div>

          <div class="text-right">
            <h2 class="text-xl font-extrabold text-gray-800">
              INVOICE
            </h2>

            <p class="mt-2 text-xs">
              <b>Order ID:</b>
              ${escapeHTML(order.orderId || "N/A")}
            </p>

            <p class="mt-1 text-xs">
              <b>Date:</b> ${escapeHTML(orderDate)}
            </p>
          </div>
        </div>

        <!-- ADDRESSES -->
        <div class="mb-5 grid grid-cols-2 gap-4">

          <div class="break-inside-avoid rounded-lg border border-gray-200 p-3">
            <h3 class="mb-2 text-sm font-bold uppercase text-pink-600">
              Billing Address
            </h3>

            <p class="text-sm font-bold">
              ${escapeHTML(billingAddress.name)}
            </p>

            <p class="mt-1 text-xs leading-5 text-gray-600">
              ${addressDetails(billingAddress)}
            </p>
          </div>

          <div class="break-inside-avoid rounded-lg border border-gray-200 p-3">
            <h3 class="mb-2 text-sm font-bold uppercase text-pink-600">
              Delivery Address
            </h3>

            <p class="text-sm font-bold">
              ${escapeHTML(deliveryAddress.name || "Customer")}
            </p>

            <p class="mt-1 text-xs leading-5 text-gray-600">
              ${addressDetails(deliveryAddress)}
            </p>
          </div>

        </div>

        <!-- PAYMENT -->
        <div class="mb-5 break-inside-avoid rounded-lg border border-pink-200 bg-pink-50 p-3">
          <span class="text-sm font-bold">
            Payment Method:
          </span>

          <span class="ml-2 text-sm text-gray-700">
            ${escapeHTML(getPaymentName(order.payment))}
          </span>
        </div>

        <!-- PRODUCTS -->
        <h3 class="mb-3 text-sm font-bold uppercase text-pink-600">
          Product Details
        </h3>

        <table class="mb-5 w-full border-collapse text-xs">
          <thead class="table-header-group">
            <tr class="bg-pink-100">
              <th class="border border-gray-300 px-3 py-2 text-center">
                Sl. No.
              </th>

              <th class="border border-gray-300 px-3 py-2 text-left">
                Product Name
              </th>

              <th class="border border-gray-300 px-3 py-2 text-center">
                Qty
              </th>

              <th class="border border-gray-300 px-3 py-2 text-right">
                Price
              </th>

              <th class="border border-gray-300 px-3 py-2 text-right">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            ${
              productsHTML ||
              `<tr>
                <td colspan="5" class="border border-gray-300 p-3 text-center">
                  No products found
                </td>
              </tr>`
            }
          </tbody>
        </table>

        <!-- PRICE SUMMARY -->
        <div class="ml-auto w-1/2 break-inside-avoid">

          <h3 class="mb-2 text-sm font-bold uppercase text-pink-600">
            Price Summary
          </h3>

          <div class="flex justify-between border-b border-gray-200 py-2 text-xs">
            <span class="text-gray-600">
              Product Total Price
            </span>

            <span class="font-semibold">
              ₹${formatPrice(subtotal)}
            </span>
          </div>

          <div class="flex justify-between border-b border-gray-200 py-2 text-xs">
            <span class="text-gray-600">
              Delivery Charges
            </span>

            <span class="font-semibold text-green-600">
              ${delivery === 0 ? "FREE" : `₹${formatPrice(delivery)}`}
            </span>
          </div>

          <div class="flex justify-between border-b border-gray-200 py-2 text-xs">
            <span class="text-gray-600">
              Coupon Discount
              ${order.couponCode ? `(${escapeHTML(order.couponCode)})` : ""}
            </span>

            <span class="font-semibold text-green-600">
              - ₹${formatPrice(discount)}
            </span>
          </div>

          <div class="mt-2 flex justify-between border-t-2 border-pink-600 pt-3 text-base font-extrabold text-pink-600">
            <span>Final Price</span>
            <span>₹${formatPrice(finalTotal)}</span>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="mt-8 break-inside-avoid border-t border-gray-200 pt-4 text-center">
          <h3 class="text-base font-bold text-pink-600">
            Thank You for Shopping with Meesho!
          </h3>

          <p class="mt-1 text-xs text-gray-500">
            We hope to see you again.
          </p>
        </div>

      </div>
    `;

    // Remove previous invoice and style if any
    document.getElementById("meesho-print-invoice")?.remove();
    document.getElementById("meesho-print-style")?.remove();

    // Create invoice container
    const printContainer = document.createElement("div");

    printContainer.id = "meesho-print-invoice";

    printContainer.className =
      "hidden print:block fixed inset-0 z-[999999] bg-white";

    printContainer.innerHTML = invoiceHTML;

    // Only the global print rules are CSS.
    // Invoice design itself uses Tailwind utility classes.
    const printStyle = document.createElement("style");

    printStyle.id = "meesho-print-style";

    printStyle.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 12mm;
        }

        html,
        body {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        body > *:not(#meesho-print-invoice) {
          display: none !important;
        }

        #meesho-print-invoice {
          display: block !important;
          position: static !important;
          inset: auto !important;
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          background: white !important;
          color: #1f2937 !important;
          font-family: Arial, sans-serif !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        #meesho-print-invoice table {
          width: 100% !important;
          border-collapse: collapse !important;
        }

        #meesho-print-invoice thead {
          display: table-header-group;
        }

        #meesho-print-invoice tr,
        #meesho-print-invoice .break-inside-avoid {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }

        #meesho-print-invoice h3 {
          break-after: avoid !important;
          page-break-after: avoid !important;
        }
      }
    `;

    document.head.appendChild(printStyle);
    document.body.appendChild(printContainer);

    const cleanup = () => {
      document.getElementById("meesho-print-invoice")?.remove();
      document.getElementById("meesho-print-style")?.remove();

      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    // Wait for browser to render invoice before printing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();

        // Fallback cleanup
        setTimeout(cleanup, 60000);
      });
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-5">
          <Link
            to="/profile"
            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                My Orders
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Your complete order history
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-pink-50 px-3 py-2 text-pink-600">
              <Package size={20} />

              <span className="text-sm font-extrabold">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-14 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto mb-4 text-pink-500" />

            <h2 className="text-xl font-extrabold text-gray-900">
              No Orders Yet!
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your orders will appear here after shopping.
            </p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-pink-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ORDER HISTORY */
          <div className="space-y-3">
            {orders.map((order, index) => {
              const orderKey = order.orderId || index;
              const isExpanded = expandedOrder === orderKey;
              const items = order.items || [];
              const firstItem = items[0];

              return (
                <section
                  key={orderKey}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition"
                >
                  {/* ORDER HEADER */}
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-2.5 sm:px-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-gray-800">
                        Order ID: {order.orderId || "N/A"}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                        <CalendarDays size={12} />

                        {order.date
                          ? new Date(order.date).toLocaleDateString("en-IN")
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-gray-900">
                        ₹{formatPrice(getOrderTotal(order))}
                      </p>

                      <span className="text-[10px] font-semibold text-green-600">
                        Order Placed
                      </span>
                    </div>
                  </div>

                  {/* PRODUCT BAR */}
                  <button
                    type="button"
                    onClick={() => toggleOrder(orderKey)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-pink-50/50 sm:px-4"
                  >
                    {firstItem ? (
                      <img
                        src={firstItem.img || firstItem.image}
                        alt={firstItem.name || "Product"}
                        className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                        <Package size={25} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {firstItem?.name || "Order Products"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {items.length}{" "}
                        {items.length === 1 ? "Product" : "Products"}
                        {items.length > 1 && " in this order"}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-pink-600">
                        {isExpanded
                          ? "Close order details"
                          : "Click to view order details"}
                      </p>
                    </div>

                    <div className="shrink-0 text-gray-400">
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/70 p-4">
                      <h3 className="mb-3 text-sm font-extrabold text-gray-900">
                        Order Items
                      </h3>

                      <div className="space-y-3">
                        {items.map((item, i) => (
                          <div
                            key={item.id || i}
                            className="flex items-center gap-3 rounded-lg bg-white p-2.5"
                          >
                            <img
                              src={item.img || item.image}
                              alt={item.name || "Product"}
                              className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-gray-800">
                                {item.name || "Product"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Qty: {getQty(item)}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-bold text-gray-900">
                              ₹
                              {formatPrice(
                                Number(item.price || 0) * getQty(item),
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* DELIVERY ADDRESS */}
                      {order.address && (
                        <div className="mt-4 rounded-lg bg-white p-3">
                          <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold text-gray-900">
                            <MapPin size={16} className="text-pink-600" />
                            Delivery Address
                          </h3>

                          <p className="text-xs font-semibold text-gray-800">
                            {order.address.name}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            {getFullAddress(order.address)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Mobile: {order.address.phone}
                          </p>
                        </div>
                      )}

                      {/* ORDER PRICE SUMMARY */}
                      <div className="mt-3 rounded-lg bg-white p-3">
                        <h3 className="mb-3 text-xs font-extrabold text-gray-900">
                          Price Details
                        </h3>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Product Total Price
                            </span>

                            <span className="font-semibold">
                              ₹{formatPrice(getSubtotal(order))}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Delivery Charges
                            </span>

                            <span className="font-semibold text-green-600">
                              {getDelivery(order) === 0
                                ? "FREE"
                                : `₹${formatPrice(getDelivery(order))}`}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Coupon Discount
                            </span>

                            <span className="font-semibold text-green-600">
                              - ₹{formatPrice(getDiscount(order))}
                            </span>
                          </div>

                          <div className="flex justify-between border-t pt-3">
                            <span className="font-bold text-gray-900">
                              Final Price
                            </span>

                            <span className="text-base font-extrabold text-pink-600">
                              ₹{formatPrice(getOrderTotal(order))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PAYMENT METHOD */}
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-white p-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <CreditCard size={16} className="text-pink-600" />
                          Payment Method
                        </div>

                        <span className="text-xs font-bold text-gray-900">
                          {getPaymentName(order.payment)}
                        </span>
                      </div>

                      {/* PRINT INVOICE BUTTON */}
                      <button
                        type="button"
                        onClick={() => printInvoice(order)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-pink-600 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
                      >
                        <Printer size={18} />
                        Download / Print Invoice
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrder;