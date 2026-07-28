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
  chartImage?: string;
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
    date: "2026-07-28",
    dayOfWeek: "Tuesday",
    marketBias: "BULLISH",
    emotionState: "FOCUSED",
    supportLevels: "S&P 5,550 / NQ 19,750",
    resistanceLevels: "S&P 5,600 / NQ 20,000",
    vwapTarget: "Hold above 5,565 VWAP line",
    catalysts: "Central Bank monetary policy commentary & Tech earnings",
    rulesCommitment: "1. Max 2 trades per session\n2. Strict 1:2 R:R minimum\n3. Hard Stop-Loss entered into terminal before order execution",
    planNotes: "Expect early morning liquidity sweep below yesterday's low followed by bullish momentum trend.",
  },
  {
    id: "plan-2",
    date: "2026-07-27",
    dayOfWeek: "Monday",
    marketBias: "VOLATILE",
    emotionState: "DISCIPLINED",
    supportLevels: "EUR/USD 1.0820",
    resistanceLevels: "EUR/USD 1.0910",
    vwapTarget: "Rejection around 1.0890 upper band",
    catalysts: "Global macroeconomic data release",
    rulesCommitment: "1. No trading during high-impact news spikes\n2. Half position size due to volatility",
    planNotes: "Stay patient, wait for clear 15m breakout candle close.",
  }
];

export const SAMPLE_TRADES: SampleTrade[] = [
  {
    id: "tr-101",
    date: "2026-07-28",
    symbol: "ES_FUT",
    side: "LONG",
    entryPrice: 5560.50,
    exitPrice: 5592.00,
    stopLoss: 5550.00,
    takeProfit: 5595.00,
    quantity: 2,
    pnl: 3150,
    rMultiple: 3.0,
    strategy: "Liquidity Sweep & VWAP Rebound",
    notes: "Clean entry at morning low sweep. Trailed stop loss smoothly to lock profits.",
    chartUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-102",
    date: "2026-07-27",
    symbol: "BTCUSD",
    side: "LONG",
    entryPrice: 67200,
    exitPrice: 68900,
    stopLoss: 66400,
    takeProfit: 69000,
    quantity: 0.5,
    pnl: 850,
    rMultiple: 2.12,
    strategy: "Key Support Rejection",
    notes: "Weekend range low grab. Target hit in Asian session.",
    chartUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80",
    status: "CLOSED",
    followedEntry: true,
    followedStop: true,
    followedRisk: true,
    ruleScore: 100,
  },
  {
    id: "tr-103",
    date: "2026-07-24",
    symbol: "EURUSD",
    side: "SHORT",
    entryPrice: 1.0890,
    exitPrice: 1.0835,
    stopLoss: 1.0910,
    takeProfit: 1.0830,
    quantity: 100000,
    pnl: 550,
    rMultiple: 2.75,
    strategy: "Resistance Breakout Failure",
    notes: "Rejected exactly at pre-market resistance level.",
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
    date: "2026-07-28",
    whatWentWell: "Waited patiently for morning liquidity sweep. Position sizing was precise.",
    mistakesMade: "None. Followed pre-market plan 100%.",
    keyLearnings: "Pre-market level preparation creates effortless execution in live market hours.",
    overallRating: 5,
    ruleAdherenceScore: 100,
  }
];
