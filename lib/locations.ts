export interface Location {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const locations: Location[] = [
  { id: "nature-forest", name: "Nature Forest", description: "Lush green woodland setting", emoji: "🌲" },
  { id: "beach-sunset", name: "Beach Sunset", description: "Golden hour on the shore", emoji: "🌅" },
  { id: "city-skyline", name: "City Skyline", description: "Urban rooftop with skyscrapers", emoji: "🏙️" },
  { id: "modern-office", name: "Modern Office", description: "Sleek corporate environment", emoji: "🏢" },
  { id: "mountain-peak", name: "Mountain Peak", description: "Dramatic alpine heights", emoji: "🏔️" },
  { id: "urban-street", name: "Urban Street", description: "Vibrant city sidewalk", emoji: "🚶" },
  { id: "rooftop-bar", name: "Rooftop Bar", description: "Trendy evening venue", emoji: "🍸" },
  { id: "art-gallery", name: "Art Gallery", description: "Minimalist white walls", emoji: "🎨" },
  { id: "vintage-cafe", name: "Vintage Cafe", description: "Cozy retro atmosphere", emoji: "☕" },
  { id: "garden-terrace", name: "Garden Terrace", description: "Floral outdoor space", emoji: "🌸" },
  { id: "desert-dunes", name: "Desert Dunes", description: "Warm sandy landscape", emoji: "🏜️" },
  { id: "snowy-landscape", name: "Snowy Landscape", description: "Winter wonderland", emoji: "❄️" },
  { id: "neon-city-night", name: "Neon City Night", description: "Cyberpunk urban glow", emoji: "🌃" },
  { id: "luxury-hotel", name: "Luxury Hotel Lobby", description: "Elegant grand interior", emoji: "🏨" },
  { id: "industrial-warehouse", name: "Industrial Warehouse", description: "Raw brick and metal", emoji: "🏭" },
  { id: "tropical-paradise", name: "Tropical Paradise", description: "Palm trees and ocean", emoji: "🌴" },
  { id: "european-cobblestone", name: "European Cobblestone", description: "Historic old town charm", emoji: "🏰" },
  { id: "japanese-garden", name: "Japanese Garden", description: "Zen tranquility", emoji: "⛩️" },
  { id: "times-square", name: "New York Times Square", description: "Bright lights, big city", emoji: "🗽" },
  { id: "minimalist-studio", name: "Minimalist Studio", description: "Clean professional backdrop", emoji: "📷" },
];
