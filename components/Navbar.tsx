'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Calendar, BarChart3, LineChart, Shield, Terminal } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: Terminal },
    { href: '/plan', label: 'Trading Plan', icon: Calendar },
    { href: '/execution', label: 'Trade Journal', icon: LineChart },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/30 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-2 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-slate-100">
                AYAN CHORADIA
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                QUANT / TRADER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Market Journal & Execution Engine</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/80 p-1.5 border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 text-xs font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </header>
  );
}
