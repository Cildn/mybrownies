"use client";

import Image from "next/image";
import './footer.css';
import Link from "next/link";

export default function Footer() {

  return (
    <section className="bg-gray-100 p-3">
        <footer className="bg-white py-10 px-6 md:px-16 text-gray-700 border-t border-gray-200 rounded-lg
        mx-auto max-w-screen-xl pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* Company Info */}
      <div className="md:col-span-2">
        <Image src="/images/brownies-logo.png" alt="Brownies" width={200} height={100}></Image>
        <p className="mt-2 text-sm leading-relaxed pt-9"  style={{ fontFamily: "Hellix-Regular"}}>
          From flavors to fragrances, textures to aesthetics—Lés Brownie's crafts moments that delight all your senses.
        </p>

        <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
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

          <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-amber-900 transition hover:text-amber-900/75"
            >
              <span className="sr-only">Instagram</span>
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-amber-900 transition hover:text-amber-900/75"
            >
              <span className="sr-only">Pinterest</span>
              <svg className="size-7" fill="currentColor" viewBox="0 0 20 19" aria-hidden="true">
                <path
                  d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0"
                />
              </svg>
            </a>
          </li>
        </ul>

        <div className="flex space-x-4 mt-4">
          <a href="#" className="text-amber-900 text-xl"><i className="fab fa-facebook"></i></a>
          <a href="#" className="text-amber-900 text-xl"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-amber-900 text-xl"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-amber-900 text-xl"><i className="fab fa-github"></i></a>
          <a href="#" className="text-amber-900 text-xl"><i className="fab fa-dribbble"></i></a>
        </div>
      </div>

      {/* About Us */}
      <div>
        <h3 className="text-gray-900 font-semibold">About Us</h3>
        <ul className="mt-2 space-y-4 text-sm">
          <li><Link href="/about/history" className="hover:text-amber-900">Company History</Link></li>
        </ul>
      </div>

      {/* Our Services */}
      <div>
        <h3 className="text-gray-900 font-semibold">Our Categories</h3>
        <ul className="mt-2 space-y-4 text-sm">
          <li><Link href={"/category/Scents"} className="hover:text-amber-900 flex items-center">Scents</Link></li>
          <li><Link href={"/category/Aesthetics"} className="hover:text-amber-900 flex items-center">Aesthetics</Link></li>
          <li><Link href={"/category/Tastes"} className="hover:text-amber-900 flex items-center">Tastes</Link></li>
          <li><Link href={"/category/Feels"} className="hover:text-amber-900 flex items-center">Feels</Link></li>
        </ul>
      </div>

      {/* Helpful Links */}
      <div>
        <h3 className="text-gray-900 font-semibold">Helpful Links</h3>
        <ul className="mt-2 space-y-3 text-sm">
          <li><Link href={"/about/FAQs"} className="hover:text-amber-900 flex items-center">FAQs</Link></li>

          <li className="text-opacity-50">Live Chat: coming soon<span className="ml-1 w-2 h-2 bg-red-500  rounded-full"></span></li> {/*bg-teal-500 */}
        </ul>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-600">
      <p>&copy; 2025 Brownie&apos;s</p>
      <div className="space-x-4">
        <Link href={"/Terms&Conditions"}>Terms & Conditions</Link>
        <Link href={"/PrivacyPolicy"}>Privacy Policy</Link>
        <span>Powered by Interstellar Code</span>
      </div>
    </div>
  </footer>
    </section>
        );
      }; 
