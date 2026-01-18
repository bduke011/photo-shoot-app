"use client";

import { locations, Location } from "@/lib/locations";

interface LocationSelectorProps {
  selectedLocation: string | null;
  onLocationSelect: (location: Location) => void;
}

export default function LocationSelector({
  selectedLocation,
  onLocationSelect,
}: LocationSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">2. Choose Your Setting</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location)}
            className={`location-card p-4 bg-gray-800 hover:bg-gray-750 ${
              selectedLocation === location.id ? "selected" : ""
            }`}
          >
            <div className="text-3xl mb-2">{location.emoji}</div>
            <div className="text-sm font-medium">{location.name}</div>
            <div className="text-xs text-gray-400 mt-1">{location.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
