'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TICKERS = [
  { symbol: 'NIFTY 50', price: '24,582.40', change: '+142.10', pct: '+0.58%', up: true },
  { symbol: 'BANKNIFTY', price: '52,340.15', change: '-85.30', pct: '-0.16%', up: false },
  { symbol: 'S&P 500 (SPY)', price: '551.20', change: '+4.80', pct: '+0.88%', up: true },
  { symbol: 'NASDAQ (QQQ)', price: '482.60', change: '+6.40', pct: '+1.34%', up: true },
  { symbol: 'BTC/USD', price: '68,450.00', change: '+1,250.00', pct: '+1.86%', up: true },
  { symbol: 'GOLD (XAU)', price: '2,415.80', change: '-6.20', pct: '-0.26%', up: false },
];

export default function MarketTickerBar() {
  return (
    <div className="w-full overflow-x-auto bg-slate-950/90 border-b border-slate-800/60 py-2 px-4 scrollbar-none font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 whitespace-nowrap">
        {TICKERS.map((t, idx) => (
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
