import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppNavbar from "@/components/app-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripTogether",
  description: "Collaborative trip planning and destination voting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.2),_transparent_60%)]" />
          <header className="sticky top-0 z-20 border-b border-white/30 bg-white/65 backdrop-blur-xl">
            <AppNavbar />
          </header>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
