import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShoppingBag,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const users = JSON.parse(
        localStorage.getItem("meesho_users") || "[]"
      );

      const foundUser = users.find(
        (u) =>
          u.email?.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (!foundUser) {
        setError("Invalid email or password. Please register first.");
        setLoading(false);
        return;
      }

      setUser({
        name: foundUser.name,
        email: foundUser.email,
      });

      navigate("/profile");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-10 sm:py-16 flex items-center justify-center">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-pink-200/60 border border-pink-100">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT DESIGN SECTION */}
          <section className="relative flex min-h-[450px] flex-col justify-between overflow-hidden bg-gradient-to-br from-pink-600 via-pink-500 to-purple-700 p-8 text-white sm:p-12">

            {/* Background circles */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/10" />

            {/* Logo */}
            <Link
              to="/"
              className="relative z-10 text-3xl font-extrabold tracking-tight"
            >
              meesho<span className="text-yellow-300">.</span>
            </Link>

            {/* Welcome content */}
            <div className="relative z-10 my-10">

              <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-md">
                <ShoppingBag size={55} strokeWidth={1.5} />
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-pink-100">
                {/* <Sparkles size={18} /> */}
                Welcome Back
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Discover Your
                <br />
                Favourite Style!
              </h1>

              <p className="max-w-sm text-base leading-7 text-pink-50">
                Discover amazing products, exciting deals and
                shop your favourite styles at affordable prices.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
                  ✨ Trending Fashion
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
                  🛍️ Best Deals
                </span>
              </div>
            </div>

            <p className="relative z-10 text-sm text-pink-100">
              Shop More. Save More. Love More.
            </p>
          </section>

          {/* RIGHT LOGIN SECTION */}
          <section className="flex items-center justify-center p-6 sm:p-10 md:p-12">

            <div className="w-full max-w-md">

              {/* Heading */}
              <div className="mb-8">
                <span className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-pink-600">
                  Welcome Back!
                </span>

                <h2 className="text-3xl font-extrabold text-gray-900">
                  Login to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Welcome back! Please enter your details to continue.
                </p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-pink-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-100">
                    <Mail size={19} className="shrink-0 text-gray-400" />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-0 bg-transparent px-3 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-pink-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-100">
                    <Lock size={19} className="shrink-0 text-gray-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border-0 bg-transparent px-3 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-gray-400 hover:text-pink-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Login to Your Account"}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* REGISTER */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-pink-600 transition hover:text-purple-600 hover:underline"
                >
                  Create Account
                </Link>
              </p>

              {/* HOME LINK */}
              <Link
                to="/"
                className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
              >
                <ArrowLeft size={17} />
                Back to Shopping
              </Link>

              {/* FOOTER */}
              <p className="mt-8 text-center text-xs text-gray-400">
                © 2026 Meesho Shopping. All rights reserved.
              </p>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

export default Login;