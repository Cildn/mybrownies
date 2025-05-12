'use client'
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RegisterFormModal from '@/components/brownieCity/RegisterFormModal';
import brownie from './brownie-city.png';

export default function CampaignLanding() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { qrCode } = useParams() as { qrCode: string };

  const handleLeave = () => router.push('/');

  const handleEnter = () => {
    if (qrCode) {
      setShowModal(true);
    } else {
      alert('QR code is missing from URL parameters.');
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Full-screen banner */}
      <Image
        src={brownie}
        alt="Welcome to Brownie City"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Brownie City
        </h1>
        <p className="text-lg text-white max-w-lg mb-8">
          You’ve unlocked the mystery—solve daily clues, earn coupons, and upgrade your badge!
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleEnter}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Enter
          </button>
          <button
            onClick={handleLeave}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showModal && qrCode && (
        <RegisterFormModal
          onClose={() => setShowModal(false)}
          qrCode={qrCode}
        />
      )}
    </div>
  );
}