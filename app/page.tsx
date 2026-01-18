"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import LocationSelector from "@/components/LocationSelector";
import PromptInput from "@/components/PromptInput";
import ResultsGallery from "@/components/ResultsGallery";
import { Location } from "@/lib/locations";

interface GeneratedImage {
  url: string;
  type: string;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = imageUrl && selectedLocation && !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          location: selectedLocation.name,
          custom_prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate images");
      }

      const data = await response.json();

      if (data.success && data.images) {
        setGeneratedImages(data.images);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate images");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImageUrl("");
    setSelectedLocation(null);
    setCustomPrompt("");
    setGeneratedImages([]);
    setError(null);
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            AI Photo Shoot
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your photo and transform it into a stunning photoshoot in any setting
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          {/* Step 1: Upload */}
          <section>
            <ImageUpload onImageUploaded={setImageUrl} />
          </section>

          {/* Step 2: Location */}
          <section className={imageUrl ? "" : "opacity-50 pointer-events-none"}>
            <LocationSelector
              selectedLocation={selectedLocation?.id || null}
              onLocationSelect={setSelectedLocation}
            />
          </section>

          {/* Step 3: Custom Prompt */}
          <section className={imageUrl && selectedLocation ? "" : "opacity-50 pointer-events-none"}>
            <PromptInput value={customPrompt} onChange={setCustomPrompt} />
          </section>

          {/* Generate Button */}
          <section className="flex justify-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                canGenerate
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-3">
                  <div className="spinner w-5 h-5"></div>
                  Generating Your Photoshoot...
                </span>
              ) : (
                "Generate 5 Photoshoot Images"
              )}
            </button>
            {(generatedImages.length > 0 || error) && (
              <button
                onClick={handleReset}
                className="px-6 py-4 rounded-xl font-semibold text-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Start Over
              </button>
            )}
          </section>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Results */}
          <section>
            <ResultsGallery images={generatedImages} isLoading={isGenerating} />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by fal.ai nano-banana-pro</p>
        </footer>
      </div>
    </main>
  );
}
