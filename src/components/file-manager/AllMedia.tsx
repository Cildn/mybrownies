"use client";
import React, { useState, useEffect } from "react";
import { Folder, Play, Music, Upload, FileText, Download } from "lucide-react";
import MediaCard from "./MediaCard";
import { Modal } from "@/components/ui/modal";
import UploadFormModal from "@/components/modals/form/UploadForm";
import { FileStats } from "@/types"; // Import the specific interface

const AllMediaSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileStats, setFileStats] = useState<FileStats | null>(null);

  // Fetch file stats from the backend
  useEffect(() => {
    const fetchFileStats = async () => {
      try {
        const response = await fetch("/api/files/stats?folder=");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch file stats");
        }
        const data = await response.json();

        // Transform the backend response into the FileStats interface
        const transformedStats: FileStats = {
          images: {
            files: data.categories.images.count,
            usage: parseFloat(data.categories.images.percentageUsed),
            size: data.categories.images.size,
            color: "green",
          },
          videos: {
            files: data.categories.videos.count,
            usage: parseFloat(data.categories.videos.percentageUsed),
            size: data.categories.videos.size,
            color: "pink",
          },
          audio: {
            files: data.categories.audio.count,
            usage: parseFloat(data.categories.audio.percentageUsed),
            size: data.categories.audio.size,
            color: "blue",
          },
          docs: {
            files: data.categories.docs.count,
            usage: parseFloat(data.categories.docs.percentageUsed),
            size: data.categories.docs.size,
            color: "yellow",
          },
          uploads: {
            files: data.categories.uploads.count,
            usage: 0, // Assuming backend doesn't provide this
            size: data.categories.uploads.size,
            color: "orange",
          },
          downloads: {
            files: data.categories.downloads.count,
            usage: 0, // Assuming backend doesn't provide this
            size: data.categories.downloads.size,
            color: "purple",
          },
        };

        setFileStats(transformedStats);
      } catch (error) {
        console.error(
          "Error fetching file stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchFileStats();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Media</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            + Upload File
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fileStats ? (
          <>
            <MediaCard
              icon={Folder}
              title="Images"
              files={fileStats.images.files}
              usage={fileStats.images.usage}
              size={fileStats.images.size}
              color={fileStats.images.color}
            />
            <MediaCard
              icon={Play}
              title="Videos"
              files={fileStats.videos.files}
              usage={fileStats.videos.usage}
              size={fileStats.videos.size}
              color={fileStats.videos.color}
            />
            <MediaCard
              icon={Music}
              title="Audio"
              files={fileStats.audio.files}
              usage={fileStats.audio.usage}
              size={fileStats.audio.size}
              color={fileStats.audio.color}
            />
            <MediaCard
              icon={Upload}
              title="Uploads"
              files={fileStats.uploads.files}
              usage={fileStats.uploads.usage}
              size={fileStats.uploads.size}
              color={fileStats.uploads.color}
            />
            <MediaCard
              icon={FileText}
              title="Docs"
              files={fileStats.docs.files}
              usage={fileStats.docs.usage}
              size={fileStats.docs.size}
              color={fileStats.docs.color}
            />
            <MediaCard
              icon={Download}
              title="Downloads"
              files={fileStats.downloads.files}
              usage={fileStats.downloads.usage}
              size={fileStats.downloads.size}
              color={fileStats.downloads.color}
            />
          </>
        ) : (
          <p>Loading media stats...</p>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[600px] p-5 lg:p-10">
        <UploadFormModal onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
};

export default AllMediaSection;