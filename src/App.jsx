import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import MyOrder from "./pages/MyOrder";

const read = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return fallback;
  }
};

const getWishlistKey = (user) => {
  if (!user) return "meesho_wishlist_guest";

  const identifier =
    user.email || user.id || user._id || user.phone || user.username;

  if (!identifier) return "meesho_wishlist_guest";

  return `meesho_wishlist_${String(identifier).trim().toLowerCase()}`;
};

// Permanent profile key for each email
const getProfileKey = (email) => {
  return `meesho_profile_${String(email || "")
    .trim()
    .toLowerCase()}`;
};

// Get phone number from different possible field names
const getPhone = (user) => {
  return (
    user?.phone ||
    user?.contactNo ||
    user?.mobile ||
    user?.mobileNumber ||
    user?.contact ||
    ""
  );
};

function App() {
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  const hideFooter = ["/login", "/register"].includes(location.pathname);

  const [user, setUser] = useState(() => read("meesho_user", null));

  const [cart, setCart] = useState(() => read("meesho_cart", []));

  const [wishlist, setWishlist] = useState(() =>
    read(getWishlistKey(read("meesho_user", null)), []),
  );

  // Save cart
  useEffect(() => {
    localStorage.setItem("meesho_cart", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem(getWishlistKey(user), JSON.stringify(wishlist));
  }, [wishlist, user]);

  // Save active login user
  useEffect(() => {
    if (user) {
      localStorage.setItem("meesho_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("meesho_user");
    }
  }, [user]);

  // Save profile separately from login session
  const savePermanentProfile = (profile) => {
    const email = profile?.email?.trim().toLowerCase();

    if (!email) return;

    const profileData = {
      name: profile.name || "",
      email: profile.email || "",
      phone: getPhone(profile),
      profilePhoto: profile.profilePhoto || "",
    };

    localStorage.setItem(getProfileKey(email), JSON.stringify(profileData));
  };

  // LOGIN / REGISTER / PROFILE UPDATE
  const handleSetUser = (newUser) => {
    const incomingUser =
      typeof newUser === "function" ? newUser(user) : newUser;

    if (!incomingUser) {
      setUser(null);
      return;
    }

    const email = incomingUser.email?.trim().toLowerCase() || "";

    // Read previously saved profile
    const savedProfile = email ? read(getProfileKey(email), {}) : {};

    // Merge login data with saved profile
    const updatedUser = {
      ...savedProfile,
      ...incomingUser,

      name: incomingUser.name?.trim() || savedProfile.name || "",

      email: incomingUser.email || savedProfile.email || "",

      phone: getPhone(incomingUser) || savedProfile.phone || "",

      profilePhoto:
        incomingUser.profilePhoto || savedProfile.profilePhoto || "",
    };

    setUser(updatedUser);

    setWishlist(read(getWishlistKey(updatedUser), []));

    // Save login session
    localStorage.setItem("meesho_user", JSON.stringify(updatedUser));

    // Save permanent profile
    savePermanentProfile(updatedUser);
  };

  // LOGOUT
  const handleLogout = () => {
    setCart([]);
    localStorage.removeItem("meesho_cart");

    setWishlist(read("meesho_wishlist_guest", []));

    // Remove only active session.
    // Do not remove permanent profile data.
    setUser(null);
    localStorage.removeItem("meesho_user");

    setProfileOpen(false);
  };

  // ADD TO CART
  const addToCart = (product, qty = 1) => {
    setCart((oldCart) => {
      const existing = oldCart.find(
        (item) => String(item.id) === String(product.id),
      );

      if (existing) {
        return oldCart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                qty: (item.qty || 1) + qty,
              }
            : item,
        );
      }

      return [...oldCart, { ...product, qty }];
    });

    setWishlist((oldWishlist) =>
      oldWishlist.filter((item) => String(item.id) !== String(product.id)),
    );
  };

  // CHANGE CART QUANTITY
  const changeQty = (id, delta) => {
    setCart((oldCart) =>
      oldCart.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              qty: Math.max(1, (item.qty || 1) + delta),
            }
          : item,
      ),
    );
  };

  // REMOVE FROM CART
  const removeCart = (id) => {
    setCart((oldCart) =>
      oldCart.filter((item) => String(item.id) !== String(id)),
    );
  };

  // WISHLIST TOGGLE
  const toggleWish = (product) => {
    setWishlist((oldWishlist) => {
      const exists = oldWishlist.some(
        (item) => String(item.id) === String(product.id),
      );

      if (exists) {
        return oldWishlist.filter(
          (item) => String(item.id) !== String(product.id),
        );
      }

      return [...oldWishlist, product];
    });
  };

  const shared = {
    cart,
    setCart,
    wishlist,
    user,
    setUser: handleSetUser,
    addToCart,
    changeQty,
    removeCart,
    toggleWish,
    handleLogout,
  };

  return (
    <>
      <Header {...shared} onProfileClick={() => setProfileOpen(true)} />

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home {...shared} />} />

        <Route path="/category/:category" element={<Listing {...shared} />} />

        <Route path="/product/:id" element={<ProductDetails {...shared} />} />

        <Route path="/cart" element={<Cart {...shared} />} />

        <Route path="/wishlist" element={<Wishlist {...shared} />} />

        <Route path="/login" element={<Login setUser={handleSetUser} />} />

        <Route
          path="/register"
          element={<Register setUser={handleSetUser} />}
        />

        <Route path="/my-orders" element={<MyOrder />} />

        <Route
          path="/order"
          element={<Order cart={cart} removeCart={removeCart} />}
        />

        <Route path="*" element={<Home {...shared} />} />
      </Routes>

      {!hideFooter && <Footer />}

      {/* PROFILE MODAL */}
      {profileOpen && (
        <Profile {...shared} onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}

export default App;