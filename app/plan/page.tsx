'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Brain, 
  Target, 
  ShieldAlert, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { getTodayOrNextTradingDay, formatDateForInput, formatDateDisplay, isTradingDay } from '@/lib/date-utils';
import { addDays, parseISO } from 'date-fns';

const EMOTIONAL_STATES = [
  { id: 'DISCIPLINED', label: 'Disciplined', color: 'emerald', desc: '100% adherence to system rules. Execution ready.' },
  { id: 'CALM', label: 'Calm & Objective', color: 'cyan', desc: 'Emotionally detached from outcomes. Clear focus.' },
  { id: 'FOCUSED', label: 'Sharply Focused', color: 'blue', desc: 'Flow state. Fully tuned into market price action.' },
  { id: 'PATIENT', label: 'Patient Stalker', color: 'teal', desc: 'Waiting strictly for key levels and setup triggers.' },
  { id: 'ANXIOUS', label: 'Anxious / Hesitant', color: 'amber', desc: 'Warning: Reduce position size by 50% today.' },
  { id: 'FOMO_RISK', label: 'FOMO / Impatience', color: 'rose', desc: 'CAUTION: High risk of impulse trades. Take a breath.' },
];

export default function TradingPlanPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [marketBias, setMarketBias] = useState<string>('BULLISH');
  const [emotionState, setEmotionState] = useState<string>('DISCIPLINED');
  const [supportLevels, setSupportLevels] = useState<string>('');
  const [resistanceLevels, setResistanceLevels] = useState<string>('');
  const [vwapTarget, setVwapTarget] = useState<string>('');
  const [catalysts, setCatalysts] = useState<string>('');
  const [rulesCommitment, setRulesCommitment] = useState<string>(
    '1. Max 2 trades today.\n2. Minimum 1:2 R:R required.\n3. Hard Stop-Loss entered into terminal before entry.'
  );
  const [planNotes, setPlanNotes] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Automatically set default date to today or next trading day excluding Sat/Sun
    const targetDate = getTodayOrNextTradingDay(new Date());
    const formatted = formatDateForInput(targetDate);
    setSelectedDate(formatted);
    setDayOfWeek(formatDateDisplay(targetDate));
    fetchPlanForDate(formatted);
  }, []);

  const fetchPlanForDate = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/plan?date=${dateStr}`);
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        setMarketBias(data.marketBias || 'BULLISH');
        setEmotionState(data.emotionState || 'DISCIPLINED');
        setSupportLevels(data.supportLevels || '');
        setResistanceLevels(data.resistanceLevels || '');
        setVwapTarget(data.vwapTarget || '');
        setCatalysts(data.catalysts || '');
        setRulesCommitment(data.rulesCommitment || '1. Max 2 trades today.\n2. Minimum 1:2 R:R required.\n3. Hard Stop-Loss entered into terminal before entry.');
        setPlanNotes(data.planNotes || '');
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    }
  };

  const handleDateChange = (newDateStr: string) => {
    const d = parseISO(newDateStr);
    setSelectedDate(newDateStr);
    setDayOfWeek(formatDateDisplay(d));
    fetchPlanForDate(newDateStr);
  };

  const handlePrevTradingDay = () => {
    let curr = parseISO(selectedDate);
    do {
      curr = addDays(curr, -1);
    } while (!isTradingDay(curr));
    handleDateChange(formatDateForInput(curr));
  };

  const handleNextTradingDay = () => {
    let curr = parseISO(selectedDate);
    do {
      curr = addDays(curr, 1);
    } while (!isTradingDay(curr));
    handleDateChange(formatDateForInput(curr));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          dayOfWeek,
          marketBias,
          emotionState,
          supportLevels,
          resistanceLevels,
          vwapTarget,
          catalysts,
          rulesCommitment,
          planNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save plan:', err);
    } finally {
      setSaving(false);
    }
  };

  const currentEmotion = EMOTIONAL_STATES.find(e => e.id === emotionState) || EMOTIONAL_STATES[0];

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              PRE-MARKET PROTOCOL
            </span>
            <span className="text-xs text-slate-400 font-mono">Weekends & Holidays Auto-Skipped</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Pre-Market Trading Plan</h1>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-md">
          <button 
            type="button"
            onClick={handlePrevTradingDay}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Previous Trading Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-200 px-2">
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent border-none text-slate-100 focus:outline-none cursor-pointer"
            />
          </div>

          <button 
            type="button"
            onClick={handleNextTradingDay}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Next Trading Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSavePlan} className="space-y-8">
        {/* Section 1: Market Bias & Live Emotion Check */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Bias Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">1. Today's Market Bias & Outlook</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'BULLISH', label: 'BULLISH', color: 'emerald' },
                { id: 'BEARISH', label: 'BEARISH', color: 'rose' },
                { id: 'NEUTRAL', label: 'NEUTRAL', color: 'cyan' },
                { id: 'VOLATILE', label: 'RANGE / VOL', color: 'amber' },
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setMarketBias(b.id)}
                  className={`py-3 px-2 rounded-xl font-mono text-xs font-bold transition-all border text-center ${
                    marketBias === b.id
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              Current Active Bias: <span className="font-bold text-emerald-400">{marketBias}</span>
            </div>
          </div>

          {/* Emotional & Psychology Audit */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">2. Live Pre-Market Emotion Meter</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EMOTIONAL_STATES.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setEmotionState(st.id)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-semibold text-left transition-all border ${
                    emotionState === st.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Dynamic Psychology Advice Box */}
            <div className={`p-4 rounded-xl border text-xs space-y-1 ${
              currentEmotion.id === 'FOMO_RISK' || currentEmotion.id === 'ANXIOUS'
                ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            }`}>
              <div className="font-mono font-bold flex items-center gap-2">
                {currentEmotion.id === 'FOMO_RISK' ? <AlertTriangle className="h-4 w-4 text-rose-400" /> : <Sparkles className="h-4 w-4 text-emerald-400" />}
                PSYCHOLOGY CHECK: {currentEmotion.label.toUpperCase()}
              </div>
              <p className="text-slate-300">{currentEmotion.desc}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Levels & Macro Catalysts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Target className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">3. Technical Levels & Macro News Catalysts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-slate-300 block">KEY SUPPORT LEVELS</label>
              <input
                type="text"
                value={supportLevels}
                onChange={(e) => setSupportLevels(e.target.value)}
                placeholder="e.g. NIFTY 24,450 / SPY 548.50"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-slate-300 block">KEY RESISTANCE LEVELS</label>
              <input
                type="text"
                value={resistanceLevels}
                onChange={(e) => setResistanceLevels(e.target.value)}
                placeholder="e.g. NIFTY 24,680 / SPY 554.00"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-slate-300 block">VWAP / PIVOT TARGETS</label>
              <input
                type="text"
                value={vwapTarget}
                onChange={(e) => setVwapTarget(e.target.value)}
                placeholder="e.g. Hold VWAP 24,520 line"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-slate-300 block">MACRO NEWS & ECONOMIC CATALYSTS</label>
            <input
              type="text"
              value={catalysts}
              onChange={(e) => setCatalysts(e.target.value)}
              placeholder="e.g. Tech earnings, Central Bank interest rate commentary, NFP data release"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Daily Rules Commitment & Strategy Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">4. Daily Rules Commitment</h2>
            </div>

            <textarea
              rows={4}
              value={rulesCommitment}
              onChange={(e) => setRulesCommitment(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">5. Pre-Market Strategy Notes</h2>
            </div>

            <textarea
              rows={4}
              value={planNotes}
              onChange={(e) => setPlanNotes(e.target.value)}
              placeholder="Describe your planned trade setups, entry conditions, and invalidation criteria..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl">
          <div className="text-xs font-mono text-slate-400">
            Selected Date: <span className="text-slate-100 font-bold">{dayOfWeek}</span>
          </div>

          <div className="flex items-center gap-4">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                <CheckCircle className="h-4 w-4" /> Plan Saved to DB!
              </span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-xs font-mono font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving Plan...' : 'Save Pre-Market Plan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
