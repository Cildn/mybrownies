"use client";

import Image from "next/image";
import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <section className="bg-gray-100 px-4 py-8 sm:px-6 lg:px-16">
      <footer className="bg-white rounded-lg border-t border-gray-200 p-6 sm:p-8 lg:p-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="w-32 sm:w-40">
              <Image
                src="/images/brownies-logo.png"
                alt="Brownies"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="text-sm sm:text-base leading-relaxed" style={{ fontFamily: "Hellix-Regular" }}>
              From flavors to fragrances, textures to aesthetics—Lés Brownie&apos;s crafts moments that delight all your senses.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="text-amber-900 hover:text-amber-700">
                {/* instagram svg */}
              </a>
              <a href="#" aria-label="Pinterest" className="text-amber-900 hover:text-amber-700">
                {/* pinterest svg */}
              </a>
              {/*<li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-amber-900 transition hover:text-amber-900/75"
            >
              <span className="sr-only">Tiktok</span>
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>*/}
            </div>
          </div>
          
          {/* About Us */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base sm:text-lg">About Us</h3>
            <ul className="mt-3 space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/about/history" className="hover:text-amber-900">
                  Company History
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Categories */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base sm:text-lg">Our Categories</h3>
            <ul className="mt-3 space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/category/Scents" className="hover:text-amber-900">
                  Scents
                </Link>
              </li>
              <li>
                <Link href="/category/Aesthetics" className="hover:text-amber-900">
                  Aesthetics
                </Link>
              </li>
              <li>
                <Link href="/category/Tastes" className="hover:text-amber-900">
                  Tastes
                </Link>
              </li>
              <li>
                <Link href="/category/Feels" className="hover:text-amber-900">
                  Feels
                </Link>
              </li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base sm:text-lg">Helpful Links</h3>
            <ul className="mt-3 space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/about/FAQs" className="hover:text-amber-900">
                  FAQs
                </Link>
              </li>
              <li className="flex items-center text-gray-500">
                Live Chat: coming soon
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 space-y-3 sm:space-y-0">
          <p>© 2025 Brownie’s</p>
          <div className="flex space-x-4">
            <Link href="/Terms&Conditions" className="hover:text-amber-900">
              Terms &amp; Conditions
            </Link>
            <Link href="/PrivacyPolicy" className="hover:text-amber-900">
              Privacy Policy
            </Link>
            <span>Powered by Interstellar Code</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
