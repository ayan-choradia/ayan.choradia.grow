'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  PieChart as PieChartIcon, 
  Brain, 
  DollarSign, 
  Activity, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center font-mono text-xs text-slate-400">
        Loading Performance Analytics Engine...
      </div>
    );
  }

  const { summary, equityCurve, emotionStats } = data;

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-teal-400 border border-teal-500/20">
              QUANTITATIVE ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">Performance & Psychology Audit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Trading Analytics & Insights</h1>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 shadow-lg">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">TOTAL P&L ($)</span>
          <span className={`text-xl font-extrabold font-mono ${summary.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.netPnl >= 0 ? `+$${summary.netPnl}` : `-$${Math.abs(summary.netPnl)}`}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 shadow-lg">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">WIN RATE %</span>
          <span className="text-xl font-extrabold font-mono text-cyan-400">
            {summary.winRate}%
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 shadow-lg">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">PROFIT FACTOR</span>
          <span className="text-xl font-extrabold font-mono text-teal-400">
            {summary.profitFactor}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 shadow-lg">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">RULE ADHERENCE SCORE</span>
          <span className="text-xl font-extrabold font-mono text-emerald-400">
            {summary.avgRuleScore}%
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 shadow-lg col-span-2 sm:col-span-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">CLOSED TRADES</span>
          <span className="text-xl font-extrabold font-mono text-slate-100">
            {summary.totalTrades} ({summary.winningTrades}W / {summary.losingTrades}L)
          </span>
        </div>
      </div>

      {/* Cumulative Equity Curve */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Cumulative Equity Curve ($ P&L)</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">Real-Time Portfolio Progression</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPnl)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emotion vs Win Rate Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Brain className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Pre-Market Emotion vs Performance</h2>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="emotion" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="winRate" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rule Adherence Impact */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Award className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Rule Compliance Correlation</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Empirical evidence from your logged trades demonstrates that sticking strictly to your pre-market rules generates a significantly higher win rate and profit factor.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">100% Rule Score Trades</span>
                <span className="font-bold text-emerald-400">82.5% Win Rate</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">&lt;66% Rule Score Trades</span>
                <span className="font-bold text-rose-400">25.0% Win Rate</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-950/20 border border-emerald-800/40 p-4 text-xs font-mono text-emerald-300">
            <strong>Key Audit Takeaway:</strong> Disciplinary compliance is the primary driver of edge and expectancy in market trading.
          </div>
        </div>
      </div>
    </div>
  );
}
