import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 text-gray-700">

      {/* FOOTER MAIN SECTION */}
      <div className="w-full px-4 py-12 sm:px-6 lg:px-10 xl:px-14">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="text-4xl font-extrabold tracking-tight text-pink-600"
            >
              meesho<span className="text-purple-600">.</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-500">
              India's favourite online shopping destination.
              Find something you'll love at a price you'll love.
            </p>

            <p className="mt-5 text-sm text-gray-500">
              Shop smart. Shop happy!
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Shop
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <Link
                to="/category/Women%20Ethnic"
                className="transition-colors hover:text-pink-600"
              >
                Women Ethnic
              </Link>

              <Link
                to="/category/Men"
                className="transition-colors hover:text-pink-600"
              >
                Men
              </Link>

              <Link
                to="/category/Kids"
                className="transition-colors hover:text-pink-600"
              >
                Kids
              </Link>

              <Link
                to="/category/Home%20%26%20Kitchen"
                className="transition-colors hover:text-pink-600"
              >
                Home & Kitchen
              </Link>

            </div>
          </div>

          {/* HELP */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Help
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <a
                href="mailto:support@example.com"
                className="transition-colors hover:text-pink-600"
              >
                Contact Us
              </a>

              <Link
                to="/"
                className="transition-colors hover:text-pink-600"
              >
                Shipping & Returns
              </Link>

              <Link
                to="/"
                className="transition-colors hover:text-pink-600"
              >
                FAQs
              </Link>

              <Link
                to="/"
                className="transition-colors hover:text-pink-600"
              >
                Privacy Policy
              </Link>

            </div>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Connect With Us
            </h3>

            <p className="mb-5 text-sm leading-6 text-gray-500">
              Follow us for the latest trends, fashion updates and offers.
            </p>

            <div className="flex items-center gap-3">

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-600 transition-all hover:bg-pink-600 hover:text-white"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg text-pink-600 transition-all hover:bg-pink-600 hover:text-white"
              >
                ◎
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg text-pink-600 transition-all hover:bg-pink-600 hover:text-white"
              >
                ▶
              </a>

            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="w-full border-t border-gray-200 bg-white">

        <div className="flex w-full flex-col items-center justify-between gap-3 px-4 py-5 sm:px-6 md:flex-row lg:px-10 xl:px-14">

          <p className="text-center text-sm text-gray-500">
            © 2026 Meesho UI Clone. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Created for learning purposes ❤️
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;