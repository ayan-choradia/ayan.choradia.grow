import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MarketTickerBar from "@/components/MarketTickerBar";

export const metadata: Metadata = {
  title: "Ayan Choradia | Trader & Quantitative Developer",
  description: "Personal website, daily trading plan, trade execution journal, and quantitative performance analytics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 grid-background flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <MarketTickerBar />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center font-mono text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()} Ayan Choradia. Quantitative Trading & System Design.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Risk Disclaimer</span>
              <span>•</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">System Rules</span>
              <span>•</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">GitHub Repository</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
