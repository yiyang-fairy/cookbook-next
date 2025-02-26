import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipe = await prisma.recipes.create({
      data: {
        name: body.name,
        type: body.type,
        cooking_time: Number(body.cookTime),
        ingredients: body.ingredients.split('\n'),
        steps: body.steps.split('\n'),
      },
    });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('创建菜谱失败:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
} 