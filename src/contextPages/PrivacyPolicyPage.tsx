// pages/privacy-policy.tsx
import React from "react";
import Head from "next/head";

const PrivacyPolicy = () => {
  return (
    <div className="container mt-20 px-6 py-12 bg-gray-50 min-h-screen">
      {/* SEO Metadata */}
      <Head>
        <title>Privacy Policy - Lés Brownie’s</title>
        <meta
          name="description"
          content="Learn how Lés Brownie’s collects, uses, and protects your personal information."
        />
      </Head>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-brown-800 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">
          Effective Date: April 5th, 2025 | Last Updated: April 5th, 2025
        </p>
      </div>

      {/* Content Section */}
      <div className="prose prose-lg max-w-none prose-headings:text-brown-700 prose-p:text-gray-700 prose-ul:list-disc prose-li:text-gray-600 prose-a:text-brown-600 hover:prose-a:text-brown-800 transition-colors">
        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Information We Collect
          </h2>
          <p>
            To provide and improve our services, we collect the following types of information:
          </p>
          <ul className="space-y-2 mt-2">
            <li>
              <strong>Personal Information:</strong> Phone number, email address, and delivery
              address.
            </li>
            <li>
              <strong>Payment Information:</strong> Payments are processed via WhatsApp. We do not
              store or process payment details such as credit card numbers or bank account
              information.
            </li>
            <li>
              <strong>Order Information:</strong> Details about purchases, order history,
              preferences, and communication records.
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser type, device information,
              and website usage data for analytics, security, and improving user experience.
            </li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            How We Use Your Information
          </h2>
          <p>We use your information for the following purposes:</p>
          <ul className="space-y-2 mt-2">
            <li>To process and deliver orders efficiently.</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To enhance our website, services, and marketing efforts.</li>
            <li>To prevent fraud, ensure security, and comply with legal obligations.</li>
          </ul>
        </section>

        {/* Sharing Your Information */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Sharing Your Information
          </h2>
          <p>
            We do not sell your personal data. However, we may share necessary information with
            trusted third parties for the following reasons:
          </p>
          <ul className="space-y-2 mt-2">
            <li>
              <strong>Delivery Partners:</strong> To ensure timely and accurate delivery of your
              orders.
            </li>
            <li>
              <strong>Marketing and Analytics Services:</strong> To improve customer experience and
              tailor marketing efforts.
            </li>
            <li>
              <strong>Law Enforcement or Regulatory Bodies:</strong> When required by law or to
              protect our rights and safety.
            </li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. However, no
            online platform can guarantee 100% security. We encourage you to take steps to safeguard
            your information and avoid sharing sensitive details with unauthorized parties.
          </p>
        </section>

        {/* Cookies and Tracking Technologies */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze
            website traffic, and improve functionality. You can manage your cookie preferences
            through your browser settings.
          </p>
        </section>

        {/* Updates to This Policy */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">
            Updates to This Policy
          </h2>
          <p>
            We reserve the right to update this Privacy Policy from time to time. Any changes will
            be posted on this page with the updated effective date. We encourage you to review this
            policy periodically.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-brown-700 mb-4">Contact Us</h2>
          <p>
            For privacy concerns or further clarification, feel free to reach out to us:
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

export default PrivacyPolicy;