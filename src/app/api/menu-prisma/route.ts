import prisma from '@/lib/prisma';
import { RecipeType as PrismaRecipeType } from '@prisma/client';
import { RecipeType } from "@/types/recipe";
import { NextResponse } from "next/server";
import { createErrorResponse, validateFields } from '@/lib/api-utils';

// GET 获取所有菜单项
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    console.log("type:", type);
    console.log("id:", id);

    // 添加 Prisma 客户端状态检查
    if (!prisma) {
      console.error("Prisma 客户端未初始化");
      return createErrorResponse("数据库连接未初始化");
    }

    try {
      // 直接尝试查询，简化错误处理逻辑
      const recipes = await prisma.recipes.findMany({
        where: {
          ...(id ? { id: id } : {}),
          ...(type && type !== RecipeType.ALL ? { type: type as PrismaRecipeType } : {})
        }
      });

      if (!recipes || recipes.length === 0) {
        return createErrorResponse("未找到菜谱数据", 404);
      }

      // 如果是查询单个 id，直接返回第一个结果
      return NextResponse.json(id ? recipes[0] : recipes);
    } catch (dbError) {
      console.error("数据库查询错误:", dbError);
      return createErrorResponse("数据库查询失败", 500, dbError as Error);
    }
  } catch (error) {
    console.error("GET Error:", error);
    return createErrorResponse("服务器内部错误", 500, error as Error);
  }
}

interface RecipeInput {
  name: string;
  type: PrismaRecipeType;
  ingredients: string[];
  cooking_time: number;
  steps: string[];
  cover_images: string;
}

export async function POST(request: Request) {
  console.log("POST request");
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const dataToInsert: RecipeInput[] = Array.isArray(body) ? body : [body];

    const recipes = await prisma.recipes.createMany({
      data: dataToInsert.map(item => ({
        ...item,
        type: item.type as PrismaRecipeType,
        selected_count: 0,
        update_time: new Date()
      }))
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("POST Error:", error);
    return createErrorResponse("服务器内部错误", 500, error as Error);
  }
} 

