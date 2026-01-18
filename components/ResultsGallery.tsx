"use client";

import { useState } from "react";

interface GeneratedImage {
  url: string;
  type: string;
}

interface ResultsGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

const typeLabels: Record<string, string> = {
  headshot: "Portrait Headshot",
  full_body: "Full Body Shot",
  candid: "Candid Lifestyle",
  dramatic: "Dramatic Portrait",
  environmental: "Environmental",
};

export default function ResultsGallery({ images, isLoading }: ResultsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Your Photoshoot</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-gray-800 rounded-xl animate-pulse flex items-center justify-center"
            >
              <div className="text-center">
                <div className="spinner w-8 h-8 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Generating...</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 mt-4">
          Creating your photoshoot images... This may take a minute.
        </p>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Your Photoshoot</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, i) => (
          <div
            key={i}
            className="relative group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={image.url}
                alt={`Generated ${image.type}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
              <span className="text-sm font-medium">
                {typeLabels[image.type] || image.type}
              </span>
            </div>
          </div>
        ))}
      </div>

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
  );
}
