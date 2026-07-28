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
  Sparkles,
  MessageSquareText
} from 'lucide-react';
import { getTodayOrNextTradingDay, formatDateForInput, formatDateDisplay, isTradingDay } from '@/lib/date-utils';
import { addDays, parseISO } from 'date-fns';
import ImagePasteInput from '@/components/ImagePasteInput';

const EMOTIONAL_STATES = [
  { id: 'DISCIPLINED', label: 'Disciplined', desc: '100% adherence to system rules. Execution ready.' },
  { id: 'CALM', label: 'Calm & Objective', desc: 'Emotionally detached from outcomes. Clear focus.' },
  { id: 'FOCUSED', label: 'Sharply Focused', desc: 'Flow state. Fully tuned into market price action.' },
  { id: 'PATIENT', label: 'Patient Stalker', desc: 'Waiting strictly for key levels and setup triggers.' },
  { id: 'ANXIOUS', label: 'Anxious / Hesitant', desc: 'Warning: Reduce position size by 50% today.' },
  { id: 'FOMO_RISK', label: 'FOMO / Impatience', desc: 'CAUTION: High risk of impulse trades. Take a breath.' },
];

export default function TradingPlanPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [marketBias, setMarketBias] = useState<string>('BULLISH');
  const [emotionState, setEmotionState] = useState<string>('DISCIPLINED');
  const [planNotes, setPlanNotes] = useState<string>('');
  const [chartImage, setChartImage] = useState<string>('');
  const [supportLevels, setSupportLevels] = useState<string>('');
  const [resistanceLevels, setResistanceLevels] = useState<string>('');
  const [vwapTarget, setVwapTarget] = useState<string>('');
  const [catalysts, setCatalysts] = useState<string>('');
  const [rulesCommitment, setRulesCommitment] = useState<string>(
    '1. Max 2 trades per session.\n2. Minimum 1:2 R:R required.\n3. Hard Stop-Loss entered into terminal before entry.'
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const targetDate = getTodayOrNextTradingDay(new Date());
    const formatted = formatDateForInput(targetDate);
    setSelectedDate(formatted);
    setDayOfWeek(formatDateDisplay(targetDate));
    fetchPlanForDate(formatted);
  }, []);

  const fetchPlanForDate = async (dateStr: string) => {
    // Check localStorage first for instant client persistence
    const localKey = `trading_plan_${dateStr}`;
    const localData = typeof window !== 'undefined' ? localStorage.getItem(localKey) : null;
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setMarketBias(parsed.marketBias || 'BULLISH');
        setEmotionState(parsed.emotionState || 'DISCIPLINED');
        setPlanNotes(parsed.planNotes || '');
        setChartImage(parsed.chartImage || '');
        setSupportLevels(parsed.supportLevels || '');
        setResistanceLevels(parsed.resistanceLevels || '');
        setVwapTarget(parsed.vwapTarget || '');
        setCatalysts(parsed.catalysts || '');
        setRulesCommitment(parsed.rulesCommitment || '1. Max 2 trades per session.\n2. Minimum 1:2 R:R required.\n3. Hard Stop-Loss entered into terminal before entry.');
      } catch (e) {
        console.error('Error reading localStorage plan:', e);
      }
    }

    try {
      const res = await fetch(`/api/plan?date=${dateStr}`);
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        if (!localData) {
          setMarketBias(data.marketBias || 'BULLISH');
          setEmotionState(data.emotionState || 'DISCIPLINED');
          setPlanNotes(data.planNotes || '');
          setChartImage(data.chartImage || '');
          setSupportLevels(data.supportLevels || '');
          setResistanceLevels(data.resistanceLevels || '');
          setVwapTarget(data.vwapTarget || '');
          setCatalysts(data.catalysts || '');
          setRulesCommitment(data.rulesCommitment || '1. Max 2 trades per session.\n2. Minimum 1:2 R:R required.\n3. Hard Stop-Loss entered into terminal before entry.');
        }
      }
    } catch (err) {
      console.warn('API fetch warning:', err);
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

    const planPayload = {
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
      chartImage,
    };

    // 1. Save immediately to LocalStorage (Guarantees local persistence on Vercel/Netlify)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`trading_plan_${selectedDate}`, JSON.stringify(planPayload));
    }

    // 2. Also send to API endpoint
    try {
      await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planPayload),
      });
    } catch (err) {
      console.warn('API save notice (fallback used):', err);
    } finally {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
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
              DAILY PRE-MARKET PLAN
            </span>
            <span className="text-xs text-slate-400 font-mono">Weekends (Sat/Sun) & Holidays Auto-Skipped</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Today's Market View & Trading Plan</h1>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-md">
          <button 
            type="button"
            onClick={handlePrevTradingDay}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Trading Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSavePlan} className="space-y-8">
        {/* Section 1: Today's View Upon the Market */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquareText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">1. What is your Today's View upon the Market?</h2>
          </div>

          <div className="space-y-4">
            <textarea
              rows={4}
              value={planNotes}
              onChange={(e) => setPlanNotes(e.target.value)}
              placeholder="Write your market thesis for today (e.g. Higher timeframe market structure, expected trend direction, liquidity sweeps, key levels to watch, risk events)..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none leading-relaxed"
              required
            />

            {/* Paste Chart Screenshot Component */}
            <ImagePasteInput
              value={chartImage}
              onChange={setChartImage}
              label="Pre-Market Chart Screenshot (Ctrl+V to Paste Screenshot)"
              placeholder="Click here and press Ctrl+V to paste chart screenshot from TradingView / terminal, or drag & drop image"
            />
          </div>
        </div>

        {/* Section 2: Market Bias & Live Emotion Check */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Bias Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">2. Market Directional Bias</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'BULLISH', label: 'BULLISH' },
                { id: 'BEARISH', label: 'BEARISH' },
                { id: 'NEUTRAL', label: 'NEUTRAL' },
                { id: 'VOLATILE', label: 'RANGE / VOL' },
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setMarketBias(b.id)}
                  className={`py-3 px-2 rounded-xl font-mono text-xs font-bold transition-all border text-center cursor-pointer ${
                    marketBias === b.id
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional State Check */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">3. Live Market Emotions & State</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EMOTIONAL_STATES.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setEmotionState(st.id)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-semibold text-left transition-all border cursor-pointer ${
                    emotionState === st.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Dynamic Advice Box */}
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

        {/* Section 3: Technical Levels & Custom Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Price Levels */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">4. Key Price Levels & Catalysts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">KEY SUPPORT LEVELS</label>
                <input
                  type="text"
                  value={supportLevels}
                  onChange={(e) => setSupportLevels(e.target.value)}
                  placeholder="e.g. 5,550 level / 1.0850 zone"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">KEY RESISTANCE LEVELS</label>
                <input
                  type="text"
                  value={resistanceLevels}
                  onChange={(e) => setResistanceLevels(e.target.value)}
                  placeholder="e.g. 5,600 level / 1.0910 zone"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">NEWS / MACRO CATALYSTS</label>
              <input
                type="text"
                value={catalysts}
                onChange={(e) => setCatalysts(e.target.value)}
                placeholder="e.g. Rate announcement, Economic data release..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Self Rules Commitment */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">5. Self-Made Rules for Today</h2>
            </div>

            <textarea
              rows={4}
              value={rulesCommitment}
              onChange={(e) => setRulesCommitment(e.target.value)}
              placeholder="List your non-negotiable rules for today's trading session..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none leading-relaxed"
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
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Market View Saved Successfully!
              </span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-xs font-mono font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Today\'s Market View'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
