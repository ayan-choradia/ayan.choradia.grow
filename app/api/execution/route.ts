import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SAMPLE_TRADES, SAMPLE_REFLECTIONS } from '@/lib/sample-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    let trades: any[] = [];
    let reflections: any[] = [];

    try {
      trades = await prisma.tradeExecution.findMany({
        orderBy: { date: 'desc' },
        take: 50
      });
      reflections = await prisma.dailyReflection.findMany({
        orderBy: { date: 'desc' },
        take: 30
      });
    } catch (dbErr) {
      console.warn('DB query failed, using sample fallbacks:', dbErr);
    }

    if (trades.length > 0 || reflections.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          trades: dateStr ? trades.filter(t => t.date.toISOString().startsWith(dateStr)) : trades,
          reflections: dateStr ? reflections.filter(r => r.date.toISOString().startsWith(dateStr)) : reflections
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        trades: dateStr ? SAMPLE_TRADES.filter(t => t.date === dateStr) : SAMPLE_TRADES,
        reflections: dateStr ? SAMPLE_REFLECTIONS.filter(r => r.date === dateStr) : SAMPLE_REFLECTIONS
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: { trades: SAMPLE_TRADES, reflections: SAMPLE_REFLECTIONS },
      message: error?.message
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'reflection') {
      const { date, whatWentWell, mistakesMade, keyLearnings, overallRating, ruleAdherenceScore } = body;
      const refDate = new Date(date);

      try {
        const reflection = await prisma.dailyReflection.upsert({
          where: { date: refDate },
          update: {
            whatWentWell,
            mistakesMade,
            keyLearnings,
            overallRating: Number(overallRating) || 5,
            ruleAdherenceScore: Number(ruleAdherenceScore) || 100
          },
          create: {
            date: refDate,
            whatWentWell,
            mistakesMade,
            keyLearnings,
            overallRating: Number(overallRating) || 5,
            ruleAdherenceScore: Number(ruleAdherenceScore) || 100
          }
        });
        return NextResponse.json({ success: true, data: reflection });
      } catch (dbErr: any) {
        console.warn('DB write failed, using client storage fallback:', dbErr?.message);
        return NextResponse.json({
          success: true,
          data: {
            id: `ref-${Date.now()}`,
            date: refDate,
            whatWentWell,
            mistakesMade,
            keyLearnings,
            overallRating: Number(overallRating) || 5,
            ruleAdherenceScore: Number(ruleAdherenceScore) || 100
          },
          storageMode: 'client'
        });
      }
    }

    // Trade logging
    const { date, symbol, side, entryPrice, exitPrice, stopLoss, takeProfit, quantity, strategy, notes, chartUrl, followedEntry, followedStop, followedRisk } = body;

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

    try {
      const trade = await prisma.tradeExecution.create({
        data: {
          date: new Date(date),
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
          followedEntry: Boolean(followedEntry),
          followedStop: Boolean(followedStop),
          followedRisk: Boolean(followedRisk),
          ruleScore
        }
      });
      return NextResponse.json({ success: true, data: trade });
    } catch (dbErr: any) {
      console.warn('DB trade log failed, using client storage fallback:', dbErr?.message);
      return NextResponse.json({
        success: true,
        data: {
          id: `tr-${Date.now()}`,
          date: new Date(date),
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
          followedEntry: Boolean(followedEntry),
          followedStop: Boolean(followedStop),
          followedRisk: Boolean(followedRisk),
          ruleScore
        },
        storageMode: 'client'
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
