
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShoppingBag,
  Mail,
  Lock,
  UserRound,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function Register({ setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const users = JSON.parse(
        localStorage.getItem("meesho_users") || "[]"
      );

      const normalizedEmail = email.trim().toLowerCase();

      const alreadyExists = users.some(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (alreadyExists) {
        setError("This email is already registered. Please login.");
        setLoading(false);
        return;
      }

      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        "meesho_users",
        JSON.stringify([...users, newUser])
      );

      setUser({
        name: newUser.name,
        email: newUser.email,
      });

      navigate("/profile");
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-10 sm:py-14 flex items-center justify-center">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-2xl shadow-pink-200/50">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT SECTION */}
          <section className="relative flex min-h-[550px] flex-col justify-between overflow-hidden bg-gradient-to-br from-pink-600 via-pink-500 to-purple-700 p-8 text-white sm:p-12">

            {/* Background decorations */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />

            {/* LOGO */}
            <Link
              to="/"
              className="relative z-10 text-3xl font-extrabold tracking-tight"
            >
              meesho<span className="text-yellow-300">.</span>
            </Link>

            {/* WELCOME CONTENT */}
            <div className="relative z-10 my-10">

              <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-md">
                <ShoppingBag size={55} strokeWidth={1.5} />
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-pink-100">
                {/* <Sparkles size={18} /> */}
                Join Our Community
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Join Meesho!
                <br />
                Start Shopping.
              </h1>

              <p className="max-w-sm text-base leading-7 text-pink-50">
                Create your account and explore thousands of
                products at amazing prices. Discover fashion,
                lifestyle and much more.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-yellow-300" />
                  <span className="text-sm text-pink-50">
                    Explore thousands of products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-yellow-300" />
                  <span className="text-sm text-pink-50">
                    Discover exciting shopping deals
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-yellow-300" />
                  <span className="text-sm text-pink-50">
                    Enjoy your shopping journey
                  </span>
                </div>

              </div>
            </div>

            <p className="relative z-10 text-sm text-pink-100">
              Your Shopping Journey Starts Here!
            </p>
          </section>

          {/* RIGHT REGISTER SECTION */}
          <section className="flex items-center justify-center p-6 sm:p-10 md:p-12">

            <div className="w-full max-w-md">

              {/* HEADING */}
              <div className="mb-7">

                <span className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-pink-600">
                  Create Your Account
                </span>

                <h2 className="text-3xl font-extrabold text-gray-900">
                  Sign Up
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter your details to create your Meesho account.
                </p>
              </div>

              {/* REGISTER FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* FULL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-pink-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-100">

                    <UserRound size={19} className="shrink-0 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={3}
                      className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
                    />
                  </div>
                </div>

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
                      className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
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
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
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

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-pink-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-100">

                    <Lock size={19} className="shrink-0 text-gray-400" />

                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="shrink-0 text-gray-400 hover:text-pink-600"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-pink-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

              </form>

              {/* DIVIDER */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs font-semibold text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* LOGIN LINK */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-pink-600 transition hover:text-purple-600 hover:underline"
                >
                  Login
                </Link>
              </p>

              {/* BACK HOME */}
              <Link
                to="/"
                className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
              >
                <ArrowLeft size={17} />
                Back to Shopping
              </Link>

              {/* FOOTER */}
              <p className="mt-7 text-center text-xs text-gray-400">
                © 2026 Meesho Shopping. All rights reserved.
              </p>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

export default Register;
