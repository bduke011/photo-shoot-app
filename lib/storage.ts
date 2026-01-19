// Local storage for saving photo shoot generations

export interface GeneratedImage {
  url: string;
  type: string;
}

export interface PhotoShoot {
  id: string;
  createdAt: string;
  sourceImageUrl: string;
  location: string;
  customPrompt: string;
  images: GeneratedImage[];
}

const STORAGE_KEY = "photo-shoot-history";

export function generateId(): string {
  return `ps_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function savePhotoShoot(shoot: Omit<PhotoShoot, "id" | "createdAt">): PhotoShoot {
  const history = getPhotoShootHistory();

  const newShoot: PhotoShoot = {
    ...shoot,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  history.unshift(newShoot);

  // Keep only last 50 shoots
  const trimmedHistory = history.slice(0, 50);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  }

  return newShoot;
}

export function getPhotoShootHistory(): PhotoShoot[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as PhotoShoot[];
  } catch {
    return [];
  }
}

export function getPhotoShootById(id: string): PhotoShoot | null {
  const history = getPhotoShootHistory();
  return history.find((shoot) => shoot.id === id) || null;
}

export function deletePhotoShoot(id: string): void {
  const history = getPhotoShootHistory();
  const filtered = history.filter((shoot) => shoot.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

export function clearHistory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
