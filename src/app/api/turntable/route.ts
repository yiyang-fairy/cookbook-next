import { NextResponse } from 'next/server';

const prizes = [
  { id: 1, name: '一等奖', probability: 0.1 },
  { id: 2, name: '二等奖', probability: 0.2 },
  { id: 3, name: '三等奖', probability: 0.3 },
  { id: 4, name: '谢谢参与', probability: 0.4 },
];

export async function POST() {
  // 随机抽奖逻辑
  const random = Math.random();
  let sum = 0;
  let prize = prizes[prizes.length - 1];

  for (const p of prizes) {
    sum += p.probability;
    if (random <= sum) {
      prize = p;
      break;
    }
  }

  return NextResponse.json({ prize });
} 