"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import ErrorPage from "next/error";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

import {
  GET_COLLECTION_BY_ID,
} from "@/lib/graphql/queries/collections";

const CollectionPage = () => {
  const { collectionId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [showInfo, setShowInfo] = useState({
    howItWorks: false,
    delivery: false,
  });

  const { loading, error, data } = useQuery(
    GET_COLLECTION_BY_ID,
    { variables: { id: collectionId }, skip: !collectionId }
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-lg">Loading collection…</div>
    </div>
  );
  if (error) return <ErrorPage statusCode={500} />;
  if (!data?.collection) return <ErrorPage statusCode={404} />;

  const { collection } = data;

  // first 4 in header; the rest are “related”
  const relatedProducts = (collection.products || []).slice(4);

  // parse the markdown-like additionalInfo into tabs
  const parseAdditionalInfo = (info = "") => {
    const sections = info.split("#").filter(s => s.trim());
    let howItWorksContent = "";
    const tabs = sections.map(section => {
      const lines = section.split("\n").map(l => l.trim());
      const title = lines[0].replace(/#+/, "").trim();
      const content = lines.slice(1).join("\n");
      if (title.toLowerCase() === "how it works") {
        howItWorksContent = content;
        return null;
      }
      return { title, content };
    }).filter(Boolean);
    return { tabs, howItWorksContent };
  };
  const { tabs, howItWorksContent } = parseAdditionalInfo(
    collection.additionalInfo
  );

  return (
    <div className="bg-[#f8f6f2] min-h-screen mt-8">
      <Navbar isVisible />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* header */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <div className="lg:w-1/2">
            <div className="relative aspect-square w-full">
              <Image
                src={
                  collection.images?.[0]
                    ? `/uploads${collection.images[0].replace("/uploads", "")}`
                    : "/placeholder-collection.jpg"
                }
                alt={collection.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-light mb-4">{collection.name}</h1>
            <p className="text-gray-600 mb-8">{collection.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {collection.products?.slice(0, 4).map((p: any) => (
                <div key={p.id} className="group">
                  <div className="relative aspect-square overflow-hidden mb-2">
                    <Image
                      src={
                        p.images?.[0]
                          ? `/uploads${p.images[0].replace("/uploads", "")}`
                          : "/placeholder-product.jpg"
                      }
                      alt={p.name}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <p className="text-center font-light text-sm">{p.name}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {howItWorksContent && (
                <div>
                  <button
                    onClick={() =>
                      setShowInfo((s) => ({ ...s, howItWorks: !s.howItWorks }))
                    }
                    className="flex justify-between w-full py-3"
                  >
                    <span>How It Works</span>
                    <FaChevronDown
                      className={
                        "transition-transform " +
                        (showInfo.howItWorks ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {showInfo.howItWorks && (
                    <div className="pb-4 text-sm text-gray-600">
                      {howItWorksContent}
                    </div>
                  )}
                </div>
              )}
              <div>
                <button
                  onClick={() =>
                    setShowInfo((s) => ({ ...s, delivery: !s.delivery }))
                  }
                  className="flex justify-between w-full py-3"
                >
                  <span>Delivery & Returns</span>
                  <FaChevronDown
                    className={
                      "transition-transform " +
                      (showInfo.delivery ? "rotate-180" : "")
                    }
                  />
                </button>
                {showInfo.delivery && (
                  <div className="pb-4 text-sm text-gray-600">
                    Free standard delivery on all orders. Express delivery
                    available at checkout. Easy 14-day returns policy.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* additional tabs */}
        {tabs.length > 0 && (
          <div className="mb-16">
            <nav className="border-b border-gray-200 mb-4">
              <ul className="flex space-x-8">
                {tabs.map((tab: any, i: number) => (
                  <li key={i}>
                    <button
                      className={
                        "pb-2 text-sm font-medium " +
                        (activeTab === i
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-gray-700")
                      }
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
              />
            </div>
          </div>
        )}

        {/* related */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-8">
              Complete Your Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden mb-3">
                    <Image
                      src={
                        p.images?.[0]
                          ? `/uploads${p.images[0].replace("/uploads", "")}`
                          : "/placeholder-product.jpg"
                      }
                      alt={p.name}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <h3 className="font-light">{p.name}</h3>
                  <p className="font-medium">
                    ₦{p.price?.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
