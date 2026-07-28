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
  Star,
  Maximize2,
  X,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { formatDateForInput, formatDateDisplay } from '@/lib/date-utils';
import ImagePasteInput from '@/components/ImagePasteInput';

export default function TradeExecutionPage() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateForInput(new Date()));
  const [trades, setTrades] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Trade Form State - Universal freeform product input
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [strategy, setStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [chartUrl, setChartUrl] = useState('');

  // Self-Made Rules Checklist
  const [followedEntry, setFollowedEntry] = useState(true);
  const [followedStop, setFollowedStop] = useState(true);
  const [followedRisk, setFollowedRisk] = useState(true);

  // Daily Learning & Retrospective State
  const [whatWentWell, setWhatWentWell] = useState('');
  const [mistakesMade, setMistakesMade] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [overallRating, setOverallRating] = useState(5);

  const [submittingTrade, setSubmittingTrade] = useState(false);
  const [savingReflection, setSavingReflection] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchTradesAndReflections();
  }, [selectedDate]);

  const fetchTradesAndReflections = async () => {
    setLoading(true);

    // Read from LocalStorage first
    let localTrades: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const storedT = localStorage.getItem('user_executed_trades');
        if (storedT) localTrades = JSON.parse(storedT);

        const storedR = localStorage.getItem(`user_reflection_${selectedDate}`);
        if (storedR) {
          const parsedR = JSON.parse(storedR);
          setWhatWentWell(parsedR.whatWentWell || '');
          setMistakesMade(parsedR.mistakesMade || '');
          setKeyLearnings(parsedR.keyLearnings || '');
          setOverallRating(parsedR.overallRating || 5);
        }
      } catch (e) {
        console.error('Error reading localStorage execution data:', e);
      }
    }

    try {
      const res = await fetch(`/api/execution`);
      const json = await res.json();
      if (json.success && json.data) {
        const apiTrades = json.data.trades || [];
        const apiReflections = json.data.reflections || [];

        // If user has customized local trades (including deletions), prioritize local storage
        if (typeof window !== 'undefined' && localStorage.getItem('user_executed_trades') !== null) {
          setTrades(localTrades);
        } else {
          setTrades(apiTrades);
        }

        setReflections(apiReflections);

        const todayRef = apiReflections.find((r: any) => 
          new Date(r.date).toISOString().startsWith(selectedDate)
        );

        if (todayRef && !localStorage.getItem(`user_reflection_${selectedDate}`)) {
          setWhatWentWell(todayRef.whatWentWell || '');
          setMistakesMade(todayRef.mistakesMade || '');
          setKeyLearnings(todayRef.keyLearnings || '');
          setOverallRating(todayRef.overallRating || 5);
        }
      } else if (localTrades.length > 0) {
        setTrades(localTrades);
      }
    } catch (err) {
      console.warn('API fetch warning:', err);
      if (localTrades.length > 0) setTrades(localTrades);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !entryPrice || !stopLoss || !takeProfit) return;

    setSubmittingTrade(true);

    const entry = Number(entryPrice);
    const exit = exitPrice ? Number(exitPrice) : undefined;
    const stop = Number(stopLoss);
    const target = Number(takeProfit);
    const qty = Number(quantity) || 1;

    let pnl: number | undefined = undefined;
    let rMultiple: number | undefined = undefined;

    if (exit !== undefined) {
      const priceDiff = side === 'LONG' ? exit - entry : entry - exit;
      pnl = priceDiff * qty;

      const riskPerUnit = Math.abs(entry - stop);
      if (riskPerUnit > 0) {
        rMultiple = Number((priceDiff / riskPerUnit).toFixed(2));
      }
    }

    let rulesFollowed = 0;
    if (followedEntry) rulesFollowed += 33.33;
    if (followedStop) rulesFollowed += 33.33;
    if (followedRisk) rulesFollowed += 33.34;
    const ruleScore = Math.round(rulesFollowed);

    const newTradeObj = {
      id: `tr-local-${Date.now()}`,
      date: new Date(selectedDate),
      symbol: symbol.toUpperCase(),
      side,
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: stop,
      takeProfit: target,
      quantity: qty,
      pnl,
      rMultiple,
      strategy: strategy || 'Discipline Execution',
      notes,
      chartUrl,
      status: exit !== undefined ? 'CLOSED' : 'OPEN',
      followedEntry,
      followedStop,
      followedRisk,
      ruleScore
    };

    // 1. Save immediately to LocalStorage
    const updated = [newTradeObj, ...trades];
    setTrades(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_executed_trades', JSON.stringify(updated));
    }

    // 2. Also send to API endpoint
    try {
      await fetch('/api/execution', {
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
    } catch (err) {
      console.warn('API save notice:', err);
    } finally {
      setSubmittingTrade(false);
      // Reset form
      setSymbol('');
      setEntryPrice('');
      setExitPrice('');
      setStopLoss('');
      setTakeProfit('');
      setNotes('');
      setChartUrl('');
    }
  };

  // Delete a single logged trade
  const handleDeleteTrade = async (tradeId: string) => {
    const filtered = trades.filter(t => t.id !== tradeId);
    setTrades(filtered);

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_executed_trades', JSON.stringify(filtered));
    }

    try {
      await fetch(`/api/execution?id=${tradeId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete notice:', err);
    }
  };

  // Delete all logged trades
  const handleClearAllTrades = async () => {
    if (!confirm('Are you sure you want to delete all logged trades?')) return;

    setTrades([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_executed_trades', JSON.stringify([]));
    }

    try {
      await fetch(`/api/execution?id=all`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API clear all notice:', err);
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingReflection(true);
    setSavedSuccess(false);

    const reflectionObj = {
      date: selectedDate,
      whatWentWell,
      mistakesMade,
      keyLearnings,
      overallRating,
      ruleAdherenceScore: 100
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`user_reflection_${selectedDate}`, JSON.stringify(reflectionObj));
    }

    try {
      await fetch('/api/execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reflection',
          ...reflectionObj
        })
      });
    } catch (err) {
      console.warn('API reflection save notice:', err);
    } finally {
      setSavingReflection(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              TRADE EXECUTION & JOURNAL
            </span>
            <span className="text-xs text-slate-400 font-mono">Log Trades, Paste Chart Screenshots & Review Learnings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Trade Execution & Learning Journal</h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 pl-2">Session Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-100 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Log Trade & Executed Trades Table */}
        <div className="lg:col-span-2 space-y-8">
          {/* New Trade Form Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Plus className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Log Executed Trade</h2>
            </div>

            <form onSubmit={handleCreateTrade} className="space-y-6">
              {/* Row 1: Freeform Product Input, Direction, Qty, Strategy */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">PRODUCT / ASSET</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Type product (e.g. ES, NQ, EURUSD, BTC, Stock)"
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
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        side === 'LONG' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
                      }`}
                    >
                      LONG
                    </button>
                    <button
                      type="button"
                      onClick={() => setSide('SHORT')}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        side === 'SHORT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-slate-400'
                      }`}
                    >
                      SHORT
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">QTY / SIZE</label>
                  <input
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">STRATEGY / SETUP</label>
                  <input
                    type="text"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    placeholder="e.g. Breakout, Reversion..."
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Paste Chart Screenshot Component */}
              <ImagePasteInput
                value={chartUrl}
                onChange={setChartUrl}
                label="Trade Chart Screenshot (Ctrl+V to Paste Screenshot)"
                placeholder="Click here and press Ctrl+V to paste chart screenshot of this trade from TradingView or chart software"
              />

              {/* Rule Compliance Checklist */}
              <div className="space-y-2 rounded-xl bg-slate-950/70 p-4 border border-slate-800/80">
                <span className="text-xs font-mono font-bold text-slate-200 block mb-2">
                  DID I FOLLOW RULES MADE BY MYSELF? (AUTO-CALCULATED SCORE %)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedEntry}
                      onChange={(e) => setFollowedEntry(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Followed Entry Setup Trigger</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedStop}
                      onChange={(e) => setFollowedStop(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Respected Stop-Loss</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={followedRisk}
                      onChange={(e) => setFollowedRisk(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Respected Position Sizing</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">TRADE NOTES & REASONING</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Why did you take this trade? What did you observe?"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
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
              <div>
                <h2 className="text-lg font-bold text-slate-100">Logged Executed Trades</h2>
                <span className="font-mono text-xs text-slate-400">{trades.length} Total Trades Recorded</span>
              </div>

              {trades.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllTrades}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 px-3 py-1.5 font-mono text-xs text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear All Trades
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pt-2">DATE</th>
                    <th className="pb-3 pt-2">PRODUCT</th>
                    <th className="pb-3 pt-2">SIDE</th>
                    <th className="pb-3 pt-2">ENTRY / EXIT</th>
                    <th className="pb-3 pt-2">P&L (RESULT)</th>
                    <th className="pb-3 pt-2">R-MULTIPLE</th>
                    <th className="pb-3 pt-2">RULES SCORE</th>
                    <th className="pb-3 pt-2">CHART</th>
                    <th className="pb-3 pt-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 font-mono text-xs">
                        No trades logged yet. Fill out the form above to add your first trade execution.
                      </td>
                    </tr>
                  ) : (
                    trades.map((t) => {
                      const isWin = (t.pnl || 0) >= 0;
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
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
                            {t.entryPrice} / {t.exitPrice !== null && t.exitPrice !== undefined ? t.exitPrice : 'OPEN'}
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
                          <td className="py-3">
                            {t.chartUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(t.chartUrl)}
                                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                <Maximize2 className="h-3 w-3" /> View Chart
                              </button>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteTrade(t.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete Trade"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: What's My Learning for Today? */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">What's My Learning for Today?</h2>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">1. WHAT WENT RIGHT TODAY?</label>
                <textarea
                  rows={3}
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  placeholder="Executed setup cleanly, respected stop loss, stayed disciplined..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">2. MISTAKES & RULES BROKEN</label>
                <textarea
                  rows={3}
                  value={mistakesMade}
                  onChange={(e) => setMistakesMade(e.target.value)}
                  placeholder="Chased entry early, over-leveraged position, exited before target..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">3. WHAT'S MY KEY LEARNING FOR TODAY?</label>
                <textarea
                  rows={3}
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                  placeholder="Write your core takeaway and rule adjustment for tomorrow..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">DISCIPLINE RATING TODAY (1-5 STARS)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
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
                  {savingReflection ? 'Saving...' : 'Save Today\'s Learnings'}
                </button>
                {savedSuccess && (
                  <p className="text-center font-mono text-xs text-emerald-400 font-bold mt-2">
                    Daily learnings saved successfully!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Chart Full Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-mono text-xs text-slate-400 mb-3">Executed Trade Chart Screenshot</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Trade Chart Preview" className="object-contain max-h-[80vh] w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
