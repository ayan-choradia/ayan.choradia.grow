import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SAMPLE_TRADES, SAMPLE_PLANS } from '@/lib/sample-data';

export async function GET() {
  try {
    let trades = await prisma.tradeExecution.findMany({
      orderBy: { date: 'asc' }
    });

    let plans = await prisma.tradingPlan.findMany({
      orderBy: { date: 'asc' }
    });

    if (trades.length === 0) {
      trades = SAMPLE_TRADES as any;
    }
    if (plans.length === 0) {
      plans = SAMPLE_PLANS as any;
    }

    const closedTrades = trades.filter(t => t.pnl !== null && t.pnl !== undefined);
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);

    const winRate = closedTrades.length > 0
      ? Math.round((winningTrades.length / closedTrades.length) * 100)
      : 0;

    const totalProfit = winningTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
    const totalLoss = Math.abs(losingTrades.reduce((acc, t) => acc + (t.pnl || 0), 0));
    const profitFactor = totalLoss > 0 ? Number((totalProfit / totalLoss).toFixed(2)) : totalProfit > 0 ? 99 : 0;

    const netPnl = Math.round(totalProfit - totalLoss);

    let cumulativePnl = 0;
    const equityCurve = closedTrades.map(t => {
      cumulativePnl += t.pnl || 0;
      return {
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pnl: Math.round(cumulativePnl),
        tradePnl: Math.round(t.pnl || 0),
        symbol: t.symbol,
      };
    });

    // Rule Score calculation
    const avgRuleScore = closedTrades.length > 0
      ? Math.round(closedTrades.reduce((acc, t) => acc + (t.ruleScore || 100), 0) / closedTrades.length)
      : 100;

    // Emotion Matrix mapping
    const emotionMap: Record<string, { total: number; wins: number; pnl: number }> = {};
    plans.forEach(plan => {
      const planDateStr = new Date(plan.date).toISOString().split('T')[0];
      const planTrades = closedTrades.filter(t => new Date(t.date).toISOString().split('T')[0] === planDateStr);
      
      const emotion = plan.emotionState || 'DISCIPLINED';
      if (!emotionMap[emotion]) {
        emotionMap[emotion] = { total: 0, wins: 0, pnl: 0 };
      }
      
      planTrades.forEach(t => {
        emotionMap[emotion].total += 1;
        if ((t.pnl || 0) > 0) emotionMap[emotion].wins += 1;
        emotionMap[emotion].pnl += (t.pnl || 0);
      });
    });

    const emotionStats = Object.keys(emotionMap).map(key => {
      const item = emotionMap[key];
      return {
        emotion: key,
        winRate: item.total > 0 ? Math.round((item.wins / item.total) * 100) : 0,
        totalTrades: item.total,
        pnl: Math.round(item.pnl),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalTrades: closedTrades.length,
          winningTrades: winningTrades.length,
          losingTrades: losingTrades.length,
          winRate,
          profitFactor,
          netPnl,
          avgRuleScore,
        },
        equityCurve,
        emotionStats,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
