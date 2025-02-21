import { supabase } from '@/lib/supabase';
import { RecipeType } from '@/types/recipe';
import { NextResponse } from 'next/server';

// GET 获取所有菜单项
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('type', type === RecipeType.ALL ? undefined : type);

    if (error) {
      return NextResponse.json(
        { error: '获取菜单数据失败' },
        { status: 500 }
      );
    }

    console.log('recipes', recipes);
    return NextResponse.json(recipes);
    
  } catch (error) {
    return NextResponse.json(
      { error: '服务器内部错误' + error },
      { status: 500 }
    );
  }
} 
