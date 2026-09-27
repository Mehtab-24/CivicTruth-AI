import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicTruth AI - Automated Municipal DPI Verification",
  description: "Multimodal visual reasoning verification agent for municipal public works & digital public infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased flex flex-col font-sans">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>CivicTruth AI • Digital Public Infrastructure & Municipal Governance</p>
            <p className="text-zinc-500">Hackathon Track 1 • Build with AI: Code for Communities</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
