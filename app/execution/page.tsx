'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Plus, 
  CheckSquare, 
  Award, 
  DollarSign, 
  ExternalLink, 
  Save, 
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  BookOpen,
  Star
} from 'lucide-react';
import { formatDateForInput, formatDateDisplay } from '@/lib/date-utils';

export default function TradeExecutionPage() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateForInput(new Date()));
  const [trades, setTrades] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Trade Form State
  const [symbol, setSymbol] = useState('NIFTY');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [strategy, setStrategy] = useState('Liquidity Sweep & VWAP Rebound');
  const [notes, setNotes] = useState('');
  const [chartUrl, setChartUrl] = useState('');

  // Rule Compliance Checkboxes
  const [followedEntry, setFollowedEntry] = useState(true);
  const [followedStop, setFollowedStop] = useState(true);
  const [followedRisk, setFollowedRisk] = useState(true);

  // Reflection State
  const [whatWentWell, setWhatWentWell] = useState('');
  const [mistakesMade, setMistakesMade] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [overallRating, setOverallRating] = useState(5);

  const [submittingTrade, setSubmittingTrade] = useState(false);
  const [savingReflection, setSavingReflection] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchTradesAndReflections();
  }, [selectedDate]);

  const fetchTradesAndReflections = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/execution`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrades(json.data.trades || []);
        setReflections(json.data.reflections || []);
        
        const todayRef = (json.data.reflections || []).find((r: any) => 
          new Date(r.date).toISOString().startsWith(selectedDate)
        );

        if (todayRef) {
          setWhatWentWell(todayRef.whatWentWell || '');
          setMistakesMade(todayRef.mistakesMade || '');
          setKeyLearnings(todayRef.keyLearnings || '');
          setOverallRating(todayRef.overallRating || 5);
        }
      }
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryPrice || !stopLoss || !takeProfit) return;

    setSubmittingTrade(true);
    try {
      const res = await fetch('/api/execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'trade',
          date: selectedDate,
          symbol,
          side,
          entryPrice,
          exitPrice,
          stopLoss,
          takeProfit,
          quantity,
          strategy,
          notes,
          chartUrl,
          followedEntry,
          followedStop,
          followedRisk
        })
      });

      const json = await res.json();
      if (json.success) {
        fetchTradesAndReflections();
        // Reset form
        setEntryPrice('');
        setExitPrice('');
        setNotes('');
        setChartUrl('');
      }
    } catch (err) {
      console.error('Failed to log trade:', err);
    } finally {
      setSubmittingTrade(false);
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingReflection(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reflection',
          date: selectedDate,
          whatWentWell,
          mistakesMade,
          keyLearnings,
          overallRating,
          ruleAdherenceScore: 100
        })
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        fetchTradesAndReflections();
      }
    } catch (err) {
      console.error('Failed to save reflection:', err);
    } finally {
      setSavingReflection(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              EXECUTION ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Trade & Rule Logger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Trade Execution & Journal</h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 pl-2">Session Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Log Trade & Trades History */}
        <div className="lg:col-span-2 space-y-8">
          {/* New Trade Form Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Plus className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Log New Trade Execution</h2>
            </div>

            <form onSubmit={handleCreateTrade} className="space-y-6">
              {/* Row 1: Symbol, Direction, Quantity, Strategy */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">TICKER SYMBOL</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="NIFTY / SPY / BTC"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">DIRECTION</label>
                  <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSide('LONG')}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                        side === 'LONG' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
                      }`}
                    >
                      LONG
                    </button>
                    <button
                      type="button"
                      onClick={() => setSide('SHORT')}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                        side === 'SHORT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-slate-400'
                      }`}
                    >
                      SHORT
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">QTY / CONTRACTS</label>
                  <input
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">STRATEGY</label>
                  <input
                    type="text"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    placeholder="e.g. Liquidity Sweep"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Price levels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">ENTRY PRICE</label>
                  <input
                    type="number"
                    step="any"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="24,480"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">STOP LOSS</label>
                  <input
                    type="number"
                    step="any"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="24,430"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">TAKE PROFIT</label>
                  <input
                    type="number"
                    step="any"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="24,630"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">EXIT PRICE (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    placeholder="24,620"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rule Compliance Checklist */}
              <div className="space-y-2 rounded-xl bg-slate-950/70 p-4 border border-slate-800/80">
                <span className="text-xs font-mono font-bold text-slate-200 block mb-2">
                  RULE COMPLIANCE CHECK (AUTO-SCORED)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedEntry}
                      onChange={(e) => setFollowedEntry(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Followed Entry Setup</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedStop}
                      onChange={(e) => setFollowedStop(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Respected Stop Loss</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedRisk}
                      onChange={(e) => setFollowedRisk(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Proper Position Sizing</span>
                  </label>
                </div>
              </div>

              {/* Notes & Chart Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">CHART SCREENSHOT / LINK</label>
                  <input
                    type="url"
                    value={chartUrl}
                    onChange={(e) => setChartUrl(e.target.value)}
                    placeholder="https://tradingview.com/x/..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">TRADE NOTES</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Execution details, market reaction..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingTrade}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-mono font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  {submittingTrade ? 'Logging Trade...' : 'Log Executed Trade'}
                </button>
              </div>
            </form>
          </div>

          {/* Trade Executions History Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100">Trade Execution Log</h2>
              <span className="font-mono text-xs text-slate-400">{trades.length} Total Trades Recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pt-2">DATE</th>
                    <th className="pb-3 pt-2">TICKER</th>
                    <th className="pb-3 pt-2">SIDE</th>
                    <th className="pb-3 pt-2">ENTRY / EXIT</th>
                    <th className="pb-3 pt-2">P&L</th>
                    <th className="pb-3 pt-2">R-MULTIPLE</th>
                    <th className="pb-3 pt-2">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trades.map((t) => {
                    const isWin = (t.pnl || 0) >= 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 text-slate-300">
                          {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3 font-bold text-slate-100">{t.symbol}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            t.side === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {t.side}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">
                          {t.entryPrice} / {t.exitPrice || 'OPEN'}
                        </td>
                        <td className={`py-3 font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.pnl !== null && t.pnl !== undefined ? (isWin ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`) : 'OPEN'}
                        </td>
                        <td className="py-3 text-slate-200">
                          {t.rMultiple ? `${t.rMultiple > 0 ? '+' : ''}${t.rMultiple}R` : '-'}
                        </td>
                        <td className="py-3">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {t.ruleScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Retrospective & Learnings */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Daily Retrospective & Learnings</h2>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">1. WHAT WENT WELL TODAY?</label>
                <textarea
                  rows={3}
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  placeholder="Executed pre-market setup cleanly, held winners to key VWAP band..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">2. MISTAKES & RULES BROKEN</label>
                <textarea
                  rows={3}
                  value={mistakesMade}
                  onChange={(e) => setMistakesMade(e.target.value)}
                  placeholder="Exited 20% early prior to target hit, chased entry on 1m candle..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">3. KEY LEARNING FOR TOMORROW</label>
                <textarea
                  rows={3}
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                  placeholder="Trust the higher timeframe level invalidation point without micro-managing..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">DAY DISCIPLINE RATING (1-5 STARS)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className={`p-2 rounded-xl border transition-all ${
                        overallRating >= star ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingReflection}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-mono font-bold text-slate-100 transition-all border border-slate-700 cursor-pointer"
                >
                  <Save className="h-4 w-4 text-emerald-400" />
                  {savingReflection ? 'Saving Notes...' : 'Save Daily Learnings'}
                </button>
                {savedSuccess && (
                  <p className="text-center font-mono text-xs text-emerald-400 font-bold mt-2">
                    Retrospective saved!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
