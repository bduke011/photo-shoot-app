"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPhotoShootHistory, deletePhotoShoot, clearHistory, PhotoShoot } from "@/lib/storage";

export default function GalleryPage() {
  const [history, setHistory] = useState<PhotoShoot[]>([]);
  const [selectedShoot, setSelectedShoot] = useState<PhotoShoot | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);

  useEffect(() => {
    setHistory(getPhotoShootHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this photo shoot?")) {
      deletePhotoShoot(id);
      setHistory(getPhotoShootHistory());
      if (selectedShoot?.id === id) {
        setSelectedShoot(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      clearHistory();
      setHistory([]);
      setSelectedShoot(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typeLabels: Record<string, string> = {
    headshot: "Portrait Headshot",
    full_body: "Full Body Shot",
    candid: "Candid Lifestyle",
    dramatic: "Dramatic Portrait",
    environmental: "Environmental",
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Generator
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Your Photo Shoots
            </h1>
            <p className="text-gray-400 mt-2">
              {history.length} {history.length === 1 ? "shoot" : "shoots"} saved
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear All History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No photo shoots yet</h2>
            <p className="text-gray-500 mb-6">Generate your first AI photo shoot to see it here</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-colors"
            >
              Create Photo Shoot
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* History List */}
            <div className="lg:col-span-1 space-y-4">
              {history.map((shoot) => (
                <div
                  key={shoot.id}
                  onClick={() => setSelectedShoot(shoot)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedShoot?.id === shoot.id
                      ? "bg-purple-600/20 border border-purple-500/50"
                      : "bg-gray-800 hover:bg-gray-750 border border-transparent"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {shoot.images[0] ? (
                        <img
                          src={shoot.images[0].url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{shoot.location}</h3>
                      <p className="text-sm text-gray-400">{shoot.images.length} images</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(shoot.createdAt)}</p>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(shoot.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Shoot Detail */}
            <div className="lg:col-span-2">
              {selectedShoot ? (
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedShoot.location}</h2>
                    {selectedShoot.customPrompt && (
                      <p className="text-gray-400 italic">"{selectedShoot.customPrompt}"</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Created {formatDate(selectedShoot.createdAt)}
                    </p>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedShoot.images.map((image, i) => (
                      <div
                        key={i}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="aspect-[3/4] bg-gray-700 rounded-xl overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Generated ${image.type}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
                          <span className="text-sm font-medium text-white">
                            {typeLabels[image.type] || image.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download All Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        selectedShoot.images.forEach((img, i) => {
                          const link = document.createElement("a");
                          link.href = img.url;
                          link.download = `${selectedShoot.location}-${img.type}-${i + 1}.png`;
                          link.click();
                        });
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-12 text-center">
                  <div className="text-4xl mb-4">👈</div>
                  <p className="text-gray-400">Select a photo shoot to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage.url}
              alt={`Generated ${selectedImage.type}`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <a
              href={selectedImage.url}
              download={`photoshoot-${selectedImage.type}.png`}
              className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
