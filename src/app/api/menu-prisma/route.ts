import { prisma } from '@/lib/prisma';  // 使用共享的 Prisma 实例
import { RecipeType as PrismaRecipeType } from '@prisma/client';
import { RecipeType } from "@/types/recipe";
import { NextResponse } from "next/server";

// GET 获取所有菜单项
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    console.log("type:", type);

    // 添加错误处理和重试逻辑
    let retries = 3;
    let recipes;
    
    while (retries > 0) {
      try {
        recipes = await prisma.recipes.findMany({
          where: type && type !== RecipeType.ALL ? {
            type: type as PrismaRecipeType
          } : undefined
        });
        break;
      } catch (error) {
        console.error(`尝试连接数据库失败，剩余重试次数: ${retries - 1}`);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      }
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "服务器内部错误: " + (error as Error).message },
      { status: 500 }
    );
  }
}

interface RecipeInput {
  name: string;
  type: PrismaRecipeType;
  ingredients: string[];
  cooking_time: number;
  steps: string[];
}

export async function POST(request: Request) {
  console.log("POST request");
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // 验证请求体是否为数组或单个对象
    const dataToInsert: RecipeInput[] = Array.isArray(body) ? body : [body];

    // 验证数据格式
    const isValidData = dataToInsert.every((item: RecipeInput) => {
      // 检查所有必需字段是否存在
      const requiredFields = ['name', 'type', 'ingredients', 'cooking_time', 'steps'];
      const hasAllFields = requiredFields.every(field => {
        const value = field === 'cooking_time' ? item.cooking_time : item[field as keyof RecipeInput];
        return value !== undefined && value !== null;
      });

      if (!hasAllFields) {
        console.log('缺少必需字段:', item);
        return false;
      }

      // 验证字段类型和格式
      const isValidType = Object.values(RecipeType).includes(item.type as RecipeType);
      const isValidIngredients = Array.isArray(item.ingredients) && item.ingredients.every((i: string) => typeof i === 'string');
      const isValidCookingTime = typeof item.cooking_time === 'number' && item.cooking_time > 0;
      const isValidSteps = Array.isArray(item.steps) && item.steps.every((s: string) => typeof s === 'string');
      const isValidName = typeof item.name === 'string' && item.name.length > 0;

      if (!isValidType) console.log('无效的菜品类型:', item.type);
      if (!isValidIngredients) console.log('无效的食材列表:', item.ingredients);
      if (!isValidCookingTime) console.log('无效的烹饪时间:', item.cooking_time);
      if (!isValidSteps) console.log('无效的烹饪步骤:', item.steps);
      if (!isValidName) console.log('无效的菜品名称:', item.name);

      return isValidType && isValidIngredients && isValidCookingTime && isValidSteps && isValidName;
    });

    if (!isValidData) {
      return NextResponse.json(
        { 
          error: "数据格式不正确",
          message: "请确保提供了所有必需字段（name、type、ingredients、cooking_time、steps），并且格式正确。"
        },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "服务器内部错误" + error },
      { status: 500 }
    );
  }
} 

