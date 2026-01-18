import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Photo Shoot",
  description: "Transform your photos into stunning photoshoot images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
