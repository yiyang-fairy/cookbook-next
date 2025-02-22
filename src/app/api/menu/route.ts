import { supabase } from "@/lib/supabase";
import { RecipeType } from "@/types/recipe";
import { NextResponse } from "next/server";

// GET 获取所有菜单项
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    console.log("type:", type);

    let query = supabase.from("recipes").select("*");

    if (type && type !== RecipeType.ALL) {
      query = query.eq("type", type);
    }
    const { data: recipes, error } = await query;

    if (error) {
      console.log("GET Error:", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json(
      { error: "服务器内部错误" + error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("POST request");
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // 验证请求体是否为数组或单个对象
    const dataToInsert = Array.isArray(body) ? body : [body];

    // 验证数据格式
    const isValidData = dataToInsert.every(item => {
      // 检查所有必需字段是否存在
      const requiredFields = ['name', 'type', 'ingredients', 'cooking_time', 'steps'];
      const hasAllFields = requiredFields.every(field => {
        const value = field === 'cooking_time' ? item.cooking_time : item[field];
        return value !== undefined && value !== null;
      });

      if (!hasAllFields) {
        console.log('缺少必需字段:', item);
        return false;
      }

      // 验证字段类型和格式
      const isValidType = Object.values(RecipeType).includes(item.type);
      const isValidIngredients = Array.isArray(item.ingredients) && item.ingredients.every(i => typeof i === 'string');
      const isValidCookingTime = typeof item.cooking_time === 'number' && item.cooking_time > 0;
      const isValidSteps = Array.isArray(item.steps) && item.steps.every(s => typeof s === 'string');
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

    const { data: recipes, error } = await supabase
      .from("recipes")
      .insert(dataToInsert)
      .select();

    if (error) {
      console.log("Error:", error);
      return NextResponse.json({ error: "插入菜单数据失败" }, { status: 500 });
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" + error },
      { status: 500 }
    );
  }
}
