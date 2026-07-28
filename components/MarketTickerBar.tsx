'use client';

import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

const GLOBAL_TICKERS = [
  { symbol: 'S&P 500 (ES)', price: '5,582.40', change: '+24.10', pct: '+0.43%', up: true },
  { symbol: 'NASDAQ (NQ)', price: '19,840.15', change: '+185.30', pct: '+0.94%', up: true },
  { symbol: 'EUR/USD', price: '1.0885', change: '+0.0012', pct: '+0.11%', up: true },
  { symbol: 'BTC/USD', price: '68,450.00', change: '+1,250.00', pct: '+1.86%', up: true },
  { symbol: 'GOLD (XAU)', price: '2,415.80', change: '-6.20', pct: '-0.26%', up: false },
  { symbol: 'CRUDE OIL (CL)', price: '78.40', change: '+0.85', pct: '+1.10%', up: true },
];

export default function MarketTickerBar() {
  return (
    <div className="w-full overflow-x-auto bg-slate-950/90 border-b border-slate-800/60 py-2 px-4 scrollbar-none font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold border-r border-slate-800 pr-4">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <span>GLOBAL MARKETS</span>
        </div>

        {GLOBAL_TICKERS.map((t, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{t.symbol}</span>
            <span className="text-slate-100 font-medium">{t.price}</span>
            <span className={`flex items-center text-[11px] font-medium ${t.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {t.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {t.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
