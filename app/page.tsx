import Link from 'next/link';
import { 
  Calendar, 
  LineChart, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Brain,
  Award,
  MessageSquareText,
  Clipboard
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { SAMPLE_TRADES, SAMPLE_PLANS } from '@/lib/sample-data';

export const revalidate = 0;

export default async function HomePage() {
  let recentTrades: any[] = [];
  let todayPlan: any = null;

  try {
    recentTrades = await prisma.tradeExecution.findMany({
      orderBy: { date: 'desc' },
      take: 3
    });
    todayPlan = await prisma.tradingPlan.findFirst({
      orderBy: { date: 'desc' }
    });
  } catch (e) {
    recentTrades = SAMPLE_TRADES.slice(0, 3) as any;
    todayPlan = SAMPLE_PLANS[0] as any;
  }

  if (recentTrades.length === 0) recentTrades = SAMPLE_TRADES.slice(0, 3) as any;
  if (!todayPlan) todayPlan = SAMPLE_PLANS[0] as any;

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 md:p-12 glow-emerald">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Activity className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            PERSONAL TRADING JOURNAL & MARKET VIEW PLATFORM
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Write Your Market View. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Paste Charts & Log Executions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Welcome to the personal trading suite of <strong className="text-white font-semibold">Ayan Choradia</strong>. 
            Write your daily market view, paste chart screenshots directly from your terminal (`Ctrl+V`), log trades for any product, track self-made rules adherence, and review your daily learnings.
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Link 
              href="/plan"
              className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 p-5 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">Daily Market View</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">Write Pre-Market Thesis & Emotion Check</p>
              </div>
            </Link>

            <Link 
              href="/execution"
              className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 p-5 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <LineChart className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">Trade Execution Log</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">Paste Chart Screenshots & Log Results</p>
              </div>
            </Link>

            <Link 
              href="/analytics"
              className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 p-5 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">Analytics Engine</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">Equity Curve & Rule Adherence Score</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Market View & Pre-Market Plan */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Today's Pre-Market View</h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-slate-300">
              {todayPlan?.date ? new Date(todayPlan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">MARKET BIAS</span>
              <span className={`font-bold text-sm ${
                todayPlan?.marketBias === 'BULLISH' ? 'text-emerald-400' :
                todayPlan?.marketBias === 'BEARISH' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {todayPlan?.marketBias || 'NEUTRAL'}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">EMOTIONAL STATE</span>
              <span className="font-bold text-sm text-cyan-400">
                {todayPlan?.emotionState || 'DISCIPLINED'}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-500 text-[10px] block">CHART SCREENSHOT</span>
              <span className="font-bold text-sm text-emerald-400">
                {todayPlan?.chartImage ? 'Attached (Ctrl+V)' : 'None'}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-2 text-xs">
            <span className="text-slate-400 font-mono font-semibold">YOUR TODAY'S MARKET THESIS:</span>
            <p className="text-slate-300 leading-relaxed">
              {todayPlan?.planNotes || 'Write your market view upon today\'s session, key level invalidation points, and execution plan.'}
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Open Daily Market View Editor <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Self-Made Rules Framework */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Self-Made Trading Rules</h2>
          </div>

          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Strict Risk-to-Reward Ratio</strong>
                <span className="text-slate-400">Never take a trade where potential reward is less than your minimum target.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Respect Stop Loss Always</strong>
                <span className="text-slate-400">Pre-place your hard stop loss and never widen it during live trades.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Paste Chart Screenshots (Ctrl+V)</strong>
                <span className="text-slate-400">Attach chart screenshots for pre-market views and trade logs for visual review.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Recent Executed Trades */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Recent Executed Trades</h2>
            <p className="text-xs text-slate-400 font-mono">Logged executions & self-made rule adherence score</p>
          </div>
          <Link
            href="/execution"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Log & View All Trades <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentTrades.map((t: any) => {
            const isWin = (t.pnl || 0) >= 0;
            return (
              <div 
                key={t.id} 
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-100">{t.symbol}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      t.side === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {t.side}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 text-[10px] block">RESULT (P&L)</span>
                    <span className={`font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isWin ? `+$${t.pnl}` : `-$${Math.abs(t.pnl || 0)}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">R-MULTIPLE</span>
                    <span className="font-bold text-slate-200">
                      {t.rMultiple ? `${t.rMultiple > 0 ? '+' : ''}${t.rMultiple}R` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-slate-400 truncate max-w-[140px]">{t.strategy}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    {t.ruleScore}% Rule Score
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
