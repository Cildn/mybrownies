// pages/faq.tsx
import React from "react";
import Head from "next/head";

const FAQ = () => {
  return (
    <div className="container mt-20 px-6 py-12 bg-gray-50 min-h-screen">
      {/* SEO Metadata */}
      <Head>
        <title>FAQ - Lés Brownie’s</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Lés Brownie’s products and services."
        />
      </Head>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-brown-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">
          Answers to common questions about our products, services, and policies.
        </p>
      </div>

      {/* Content Section */}
      <div className="prose prose-lg max-w-none prose-headings:text-brown-700 prose-p:text-gray-700 prose-ul:list-disc prose-li:text-gray-600 prose-a:text-brown-600 hover:prose-a:text-brown-800 transition-colors">
        {/* Question 1 */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            What products does Lés Brownie’s offer?
          </h2>
          <p>
            Lés Brownie’s offers a wide range of products, including:
          </p>
          <ul className="space-y-2">
            <li><strong>Pastries:</strong> Freshly baked brownies, cakes, and desserts.</li>
            <li><strong>Fashion Items:</strong> Trendy clothing, accessories, shoes, bags, and perfumes.</li>
          </ul>
          <p>All our products are available for both retail and wholesale customers.</p>
        </section>

        {/* Question 2 */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            How do I place an order?
          </h2>
          <p>Placing an order is simple:</p>
          <ul className="space-y-2">
            <li>Visit our website or contact us via WhatsApp.</li>
            <li>Browse our catalog and select your desired items.</li>
            <li>Confirm your order by providing accurate details and making payment.</li>
            <li>Send proof of payment to finalize your purchase.</li>
          </ul>
        </section>

        {/* Question 3 */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            What payment methods do you accept?
          </h2>
          <p>
            We accept various payment methods, including bank transfers and mobile money. Payment instructions will
            be provided during the order confirmation process. Payments are processed securely via WhatsApp.
          </p>
        </section>

        {/* Question 4 */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Do you sell infused pastries?
          </h2>
          <p>
            <strong>Hard no.</strong> We only infuse our pastries with deliciousness—no artificial additives or
            unconventional ingredients. Our focus is on creating high-quality, tasty treats that everyone can enjoy
            safely.
          </p>
        </section>

        {/* Question 5 */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Do you offer delivery services?
          </h2>
          <p>Yes! We offer delivery for pastry and fashion orders:</p>
          <ul className="space-y-2">
            <li><strong>Pastry Orders:</strong> Available for pickup or delivery within specified locations.</li>
            <li>
              <strong>Fashion Items:</strong> Orders are processed within [X business days] and delivered within
              [estimated delivery time].
            </li>
          </ul>
          <p>Delivery fees vary based on location and order size.</p>
        </section>

        {/* Remaining Questions */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Can I cancel or modify my order?
          </h2>
          <p>
            Once an order has been processed and confirmed, it cannot be cancelled or modified. Please double-check
            your order details before confirming.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            What if I receive the wrong item or a damaged product?
          </h2>
          <p>
            We apologize for any inconvenience caused! If you receive the wrong item or a damaged product, please
            notify us within <strong>24 hours</strong> of receiving your order. We’ll either provide a replacement
            or issue a refund.
          </p>
        </section>

        {/* Add remaining questions here... */}
      </div>
    </div>
  );
};

export default FAQ;