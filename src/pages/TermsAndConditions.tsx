// pages/terms-and-conditions.tsx
import React from "react";
import Head from "next/head";

const TermsAndConditions = () => {
  return (
    <div className="container mt-20 px-6 py-12 bg-gray-50 min-h-screen">
      {/* SEO Metadata */}
      <Head>
        <title>Terms & Conditions - Lés Brownie’s</title>
        <meta
          name="description"
          content="Review the terms and conditions governing your use of Lés Brownie’s services."
        />
      </Head>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-brown-800 mb-4">Terms & Conditions</h1>
        <p className="text-lg text-gray-600">
        Effective Date: April 5th, 2025 | Last Updated: April 5th, 2025
        </p>
      </div>

      {/* Content Section */}
      <div className="prose prose-lg max-w-none prose-headings:text-brown-700 prose-p:text-gray-700 prose-ul:list-disc prose-li:text-gray-600 prose-a:text-brown-600 hover:prose-a:text-brown-800 transition-colors">
        {/* General Terms */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">General Terms</h2>
          <p>
            Welcome to Lés Brownie’s! We’re thrilled to have you here. Our offerings include
            pastries, fashion items, shoes, bags, perfumes, and more, available for both retail
            and wholesale customers. Prices, product availability, and promotions are subject to
            change without prior notice. By placing an order, you confirm that all information
            provided is accurate and complete.
          </p>
        </section>

        {/* Orders and Payments */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Orders and Payments</h2>
          <ul className="space-y-2">
            <li>
              📱 Orders are placed and confirmed via WhatsApp. It’s quick, easy, and secure!
            </li>
            <li>
              💳 Full payment is required before your order is processed. We accept various
              payment methods—details will be shared during order placement.
            </li>
            <li>
              ✅ Customers must send proof of payment to confirm their order. Please double-check
              transaction details to avoid errors.
            </li>
          </ul>
        </section>

        {/* Shipping & Delivery */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Shipping & Delivery</h2>
          <ul className="space-y-2">
            <li>
              🍰 <strong>Pastry Orders:</strong> Available for pickup or delivery within specified
              locations. Freshness guaranteed!
            </li>
            <li>
              👗 <strong>Fashion Items:</strong> Orders are processed within [X business days] and
              typically delivered within [estimated delivery time].
            </li>
            <li>
              🚚 Delivery fees vary based on location and order size. We’ll keep it transparent!
            </li>
          </ul>
        </section>

        {/* Returns & Refunds */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Returns & Refunds</h2>
          <p>
            All sales are final once an order has been processed and delivered. However, if there’s
            an issue on our end (e.g., incorrect item sent or damaged goods), we’ve got you covered:
          </p>
          <ul className="space-y-2 mt-4">
            <li>
              ⏰ Notify us within <strong>24 hours</strong> of receiving the order.
            </li>
            <li>
              💵 Refunds will be processed within <strong>5 business days</strong> via the original
              payment method or as store credit.
            </li>
            <li>
              ❌ No refunds or exchanges are provided for personal preferences, incorrect sizing
              (for fashion items), or taste preferences (for pastries).
            </li>
          </ul>
        </section>

        {/* Product Quality & Disclaimer */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Product Quality & Disclaimer
          </h2>
          <p>
            While we strive for consistency, slight variations in pastries (taste, appearance) or
            fashion items (color, size) may occur. We’re not responsible for allergic reactions.
            Always review ingredient lists before purchasing.
          </p>
        </section>

        {/* User Conduct */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">User Conduct</h2>
          <p>
            We expect customers to provide accurate and truthful information when placing an order.
            Misuse of our website, including fraudulent activities, unauthorized transactions, or
            abusive behavior toward our team or other customers, may result in order cancellation
            and permanent exclusion from our services.
          </p>
          <p className="mt-4">
            <strong>⚠️ Legal Action:</strong> We reserve the right to pursue legal action against
            individuals or entities engaging in fraud, harassment, or violations of applicable laws.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Limitation of Liability</h2>
          <p>
            Lés Brownie’s shall not be liable for delays or losses caused by unforeseen
            circumstances, including but not limited to:
          </p>
          <ul className="space-y-2 mt-4">
            <li>🌧️ Weather conditions</li>
            <li>🚧 Strikes or labor disputes</li>
            <li>📦 Supplier issues</li>
            <li>🚚 Third-party delivery mishaps beyond our control</li>
          </ul>
        </section>

        {/* Amendments */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Amendments</h2>
          <p>
            We reserve the right to modify or update these Terms at any time. Continued use of our
            services after such changes indicates your acceptance of the updated Terms.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Contact Us</h2>
          <p>
            For inquiries or assistance, feel free to reach out to us:
          </p>
          <ul className="space-y-2 mt-4">
            <li>
              ✉️ <strong>Email:</strong>{" "}
              <a href="mailto:mybrownies01@gmail.com" className="text-brown-600 hover:text-brown-800 transition-colors">
                mybrownies01@gmail.com
              </a>
            </li>
            <li>
              📞 <strong>Phone:</strong>{" "}
              <a href="tel:09057133649" className="text-brown-600 hover:text-brown-800 transition-colors">
                09057133649
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;