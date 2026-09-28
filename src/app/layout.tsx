import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicTruth AI - Automated Municipal DPI Verification",
  description:
    "Multimodal visual reasoning verification agent for municipal public works & digital public infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>CivicTruth AI • Digital Public Infrastructure &amp; Municipal Governance</p>
            <p className="text-slate-500 font-mono">Track 1 • Build with AI: Code for Communities</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
