export interface SamplePlan {
  id: string;
  date: string;
  dayOfWeek: string;
  marketBias: "BULLISH" | "BEARISH" | "NEUTRAL" | "VOLATILE";
  emotionState: "DISCIPLINED" | "CALM" | "FOCUSED" | "PATIENT" | "ANXIOUS" | "FOMO_RISK";
  supportLevels: string;
  resistanceLevels: string;
  vwapTarget: string;
  catalysts: string;
  rulesCommitment: string;
  planNotes: string;
}

export interface SampleTrade {
  id: string;
  date: string;
  symbol: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  pnl: number;
  rMultiple: number;
  strategy: string;
  notes: string;
  chartUrl: string;
  status: "OPEN" | "CLOSED";
  followedEntry: boolean;
  followedStop: boolean;
  followedRisk: boolean;
  ruleScore: number;
}

export interface SampleReflection {
  id: string;
  date: string;
  whatWentWell: string;
  mistakesMade: string;
  keyLearnings: string;
  overallRating: number;
  ruleAdherenceScore: number;
}

export const SAMPLE_PLANS: SamplePlan[] = [
  {
    id: "plan-1",
    date: "2026-07-27",
    dayOfWeek: "Monday",
    marketBias: "BULLISH",
    emotionState: "FOCUSED",
    supportLevels: "NIFTY 24,450 / SPY 548.50",
    resistanceLevels: "NIFTY 24,680 / SPY 554.00",
    vwapTarget: "Hold above 24,520 VWAP line",
    catalysts: "Tech earnings week kick-off & Central Bank interest rate commentary",
    rulesCommitment: "1. Max 2 trades today\n2. Strict 1:2 R:R minimum\n3. Stop loss placed before entry",
    planNotes: "Looking for liquidity sweep of early morning low followed by bullish momentum reversal.",
  },
  {
    id: "plan-2",
    date: "2026-07-24",
    dayOfWeek: "Friday",
    marketBias: "VOLATILE",
    emotionState: "DISCIPLINED",
    supportLevels: "NIFTY 24,300",
    resistanceLevels: "NIFTY 24,550",
    vwapTarget: "Rejection around 24,500 upper band",
    catalysts: "Options expiration volatility",
    rulesCommitment: "1. No trades after 2:30 PM\n2. Half position sizing due to high VIX",
    planNotes: "Stay light on position size, wait for clear 15m breakout candle close.",
  },
  {
    id: "plan-3",
    date: "2026-07-23",
    dayOfWeek: "Thursday",
    marketBias: "BEARISH",
    emotionState: "CALM",
    supportLevels: "SPY 542.00",
    resistanceLevels: "SPY 547.20",
    vwapTarget: "Acceptance below VWAP 545.00",
    catalysts: "Weekly jobless claims data release",
    rulesCommitment: "1. Lock profits at 2R\n2. Never move stop loss wider",
    planNotes: "Fade initial gap up into key resistance cluster.",
  }
];

export const SAMPLE_TRADES: SampleTrade[] = [
  {
    id: "tr-101",
    date: "2026-07-27",
    symbol: "NIFTY",
    side: "LONG",
    entryPrice: 24480,
    exitPrice: 24620,
    stopLoss: 24430,
    takeProfit: 24630,
    quantity: 50,
    pnl: 7000,
    rMultiple: 2.8,
    strategy: "Liquidity Sweep & VWAP Rebound",
    notes: "Clean entry at morning low sweep. Trail stop to breakeven after +1.5R reached.",
    chartUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-102",
    date: "2026-07-24",
    symbol: "SPY",
    side: "SHORT",
    entryPrice: 552.40,
    exitPrice: 548.20,
    stopLoss: 554.10,
    takeProfit: 547.50,
    quantity: 100,
    pnl: 420,
    rMultiple: 2.47,
    strategy: "Resistance Breakout Failure",
    notes: "Rejected exactly at pre-market high level. Smooth trend downward into VWAP lower band.",
    chartUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-103",
    date: "2026-07-23",
    symbol: "BANKNIFTY",
    side: "SHORT",
    entryPrice: 52100,
    exitPrice: 52350,
    stopLoss: 52250,
    takeProfit: 51600,
    quantity: 25,
    pnl: -6250,
    rMultiple: -1.0,
    strategy: "VWAP Rejection",
    notes: "Stopped out clean. Market surged past VWAP on heavy institutional volume spike.",
    chartUrl: "",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-104",
    date: "2026-07-22",
    symbol: "QQQ",
    side: "LONG",
    entryPrice: 478.50,
    exitPrice: 484.20,
    stopLoss: 476.00,
    takeProfit: 485.00,
    quantity: 75,
    pnl: 427.50,
    rMultiple: 2.28,
    strategy: "Bullish Flag Breakout",
    notes: "Held key support zone perfectly after tech news pullback.",
    chartUrl: "",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-105",
    date: "2026-07-21",
    symbol: "BTCUSD",
    side: "LONG",
    entryPrice: 67200,
    exitPrice: 68900,
    stopLoss: 66400,
    takeProfit: 69000,
    quantity: 0.5,
    pnl: 850,
    rMultiple: 2.12,
    strategy: "Liquidity Sweep",
    notes: "Weekend range low grab. Target hit in Asian session overnight.",
    chartUrl: "",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  }
];

export const SAMPLE_REFLECTIONS: SampleReflection[] = [
  {
    id: "ref-1",
    date: "2026-07-27",
    whatWentWell: "Waited patiently for the morning liquidity sweep. Position sizing was precise.",
    mistakesMade: "Exited 20% of position slightly early prior to primary target hit.",
    keyLearnings: "Trust the higher timeframe target when market structure remains intact.",
    overallRating: 5,
    ruleAdherenceScore: 100,
  },
  {
    id: "ref-2",
    date: "2026-07-24",
    whatWentWell: "Executed SHORT strategy flawlessly without hesitation.",
    mistakesMade: "None. Stuck strictly to pre-market plan.",
    keyLearnings: "Pre-market level preparation creates effortless execution in live hours.",
    overallRating: 5,
    ruleAdherenceScore: 100,
  },
  {
    id: "ref-3",
    date: "2026-07-23",
    whatWentWell: "Accepted stop loss calmly without revenge trading.",
    mistakesMade: "Anticipated entry 3 minutes before candle close.",
    keyLearnings: "Always wait for full candle closure before entering trades.",
    overallRating: 4,
    ruleAdherenceScore: 90,
  }
];
