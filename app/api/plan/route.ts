import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SAMPLE_PLANS } from '@/lib/sample-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (dateStr) {
      const plan = await prisma.tradingPlan.findFirst({
        where: {
          date: new Date(dateStr)
        },
        include: {
          executions: true
        }
      });

      if (plan) {
        return NextResponse.json({ success: true, data: plan });
      }

      const samplePlan = SAMPLE_PLANS.find(p => p.date === dateStr);
      return NextResponse.json({ success: true, data: samplePlan || null });
    }

    const plans = await prisma.tradingPlan.findMany({
      orderBy: { date: 'desc' },
      take: 30,
      include: { executions: true }
    });

    if (plans.length > 0) {
      return NextResponse.json({ success: true, data: plans });
    }

    return NextResponse.json({ success: true, data: SAMPLE_PLANS });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: SAMPLE_PLANS, message: error?.message });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, dayOfWeek, marketBias, emotionState, supportLevels, resistanceLevels, vwapTarget, catalysts, rulesCommitment, planNotes } = body;

    const planDate = new Date(date);

    const plan = await prisma.tradingPlan.upsert({
      where: { date: planDate },
      update: {
        dayOfWeek,
        marketBias,
        emotionState,
        supportLevels,
        resistanceLevels,
        vwapTarget,
        catalysts,
        rulesCommitment,
        planNotes,
      },
      create: {
        date: planDate,
        dayOfWeek: dayOfWeek || 'Trading Day',
        marketBias: marketBias || 'NEUTRAL',
        emotionState: emotionState || 'DISCIPLINED',
        supportLevels,
        resistanceLevels,
        vwapTarget,
        catalysts,
        rulesCommitment,
        planNotes,
      }
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
