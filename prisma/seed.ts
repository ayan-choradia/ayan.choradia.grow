import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding trading journal database...');

  await prisma.tradeExecution.deleteMany({});
  await prisma.tradingPlan.deleteMany({});
  await prisma.dailyReflection.deleteMany({});

  const plan1 = await prisma.tradingPlan.create({
    data: {
      date: new Date('2026-07-28'),
      dayOfWeek: 'Tuesday',
      marketBias: 'BULLISH',
      emotionState: 'FOCUSED',
      supportLevels: 'S&P 5,550 / NQ 19,750',
      resistanceLevels: 'S&P 5,600 / NQ 20,000',
      vwapTarget: 'Hold above 5,565 VWAP line',
      catalysts: 'Central Bank monetary policy commentary & Tech earnings',
      rulesCommitment: '1. Max 2 trades per session\n2. Strict 1:2 R:R minimum\n3. Hard Stop-Loss entered into terminal before order execution',
      planNotes: 'Expect early morning liquidity sweep below yesterday low followed by bullish momentum trend.',
    }
  });

  await prisma.tradeExecution.createMany({
    data: [
      {
        planId: plan1.id,
        date: new Date('2026-07-28'),
        symbol: 'ES_FUT',
        side: 'LONG',
        entryPrice: 5560.50,
        exitPrice: 5592.00,
        stopLoss: 5550.00,
        takeProfit: 5595.00,
        quantity: 2,
        pnl: 3150,
        rMultiple: 3.0,
        strategy: 'Liquidity Sweep & VWAP Rebound',
        notes: 'Clean entry at morning low sweep. Trailed stop loss smoothly to lock profits.',
        chartUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
        status: 'CLOSED',
        followedEntry: true,
        followedStop: true,
        followedRisk: true,
        ruleScore: 100,
      },
      {
        date: new Date('2026-07-27'),
        symbol: 'BTCUSD',
        side: 'LONG',
        entryPrice: 67200,
        exitPrice: 68900,
        stopLoss: 66400,
        takeProfit: 69000,
        quantity: 0.5,
        pnl: 850,
        rMultiple: 2.12,
        strategy: 'Key Support Rejection',
        notes: 'Weekend range low grab. Target hit in Asian session.',
        chartUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80',
        status: 'CLOSED',
        followedEntry: true,
        followedStop: true,
        followedRisk: true,
        ruleScore: 100,
      }
    ]
  });

  await prisma.dailyReflection.create({
    data: {
      date: new Date('2026-07-28'),
      whatWentWell: 'Waited patiently for morning liquidity sweep. Position sizing was precise.',
      mistakesMade: 'None. Followed pre-market plan 100%.',
      keyLearnings: 'Pre-market level preparation creates effortless execution in live market hours.',
      overallRating: 5,
      ruleAdherenceScore: 100,
    }
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
