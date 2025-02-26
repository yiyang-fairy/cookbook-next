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
}

// 验证器函数
const recipeValidators = {
  name: (value: string) => typeof value === 'string' && value.length > 0,
  type: (value: PrismaRecipeType) => Object.values(RecipeType).includes(value as RecipeType),
  ingredients: (value: string[]) => Array.isArray(value) && value.every(i => typeof i === 'string'),
  cooking_time: (value: number) => typeof value === 'number' && value > 0,
  steps: (value: string[]) => Array.isArray(value) && value.every(s => typeof s === 'string')
};

export async function POST(request: Request) {
  console.log("POST request");
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // 验证请求体是否为数组或单个对象
    const dataToInsert: RecipeInput[] = Array.isArray(body) ? body : [body];

    // 验证每个菜谱数据
    for (const item of dataToInsert) {
      const validation = validateFields(
        item,
        ['name', 'type', 'ingredients', 'cooking_time', 'steps'] as (keyof RecipeInput)[],
        recipeValidators
      );

      if (!validation.isValid) {
        return createErrorResponse(
          "数据格式不正确",
          400,
          new Error(validation.errors.join(', '))
        );
      }
    }

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

