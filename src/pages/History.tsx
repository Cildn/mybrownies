"use client";
import React from "react";
import Link from "next/link";

const CompanyHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-950 to-orange-800 dark:from-amber-700 dark:to-orange-500">
          Our Story
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400">
          From humble beginnings to sweet success—this is the journey of Lés Brownie&apos;s.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-12">
        {/* First Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            It All Started With Cocktails...
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            At Lés Brownie&apos;s, our journey didn’t start with brownies. We began by selling cocktails
            and mocktails at dinner events, all while juggling a couple of side hustles. We didn’t
            have it all figured out, but we had drive—and we knew we wanted to build something
            meaningful.
          </p>
        </section>

        {/* Second Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Building the Foundation
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Throughout 2024, we pitched in money, saved, and planned until we officially launched
            Brownie&apos;s. We started by delivering baked goods to nearby cafeterias. That first
            step—seeing our products on those shelves—was a small but powerful win. It gave us the
            fuel we needed to keep going.
          </p>
        </section>

        {/* Third Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hustle and Heart
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            From there, we went door to door, hostel to hostel—selling, promoting, and getting more
            people to know about our brand. We listened closely to every bit of feedback and used
            it to grow. Our goal has always been simple: to provide quality products at affordable
            prices, because we understand how expensive life can get. In spite of it all, we stay
            committed to delivering value—quality, quantity, and cost—all in one.
          </p>
        </section>

        {/* Fourth Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Expanding Our Reach
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Now, as we prepare to launch our website, we’re excited to expand our reach beyond our
            local beginnings. We want to serve not just students, but customers across Nigeria.
            It’s not always easy, but we try our best. We’re hustlers, and we’re proud of how far
            we’ve come—and how far we’re going.
          </p>
        </section>

        {/* Closing Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            More Than Just Business
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            For us, this isn&apos;t just business—it’s heart. We know what it means to hustle, to manage
            tight budgets, and to crave something that brings a little joy to the day. That&apos;s why,
            no matter what, we maintain a balance between excellent quality, generous portions, and
            friendly prices.
          </p>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="text-center mt-16">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Join us on this sweet journey—because everyone deserves a taste of happiness.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-amber-900 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-semibold rounded-md shadow-md transition duration-300"
        >
          Explore Our Products
        </Link>
      </footer>
    </div>
  );
};

export default CompanyHistory;