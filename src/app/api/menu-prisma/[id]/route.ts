import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let retries = 3;
    let recipe = null;

    while (retries > 0) {
      try {
        recipe = await prisma.recipes.findFirst({
          where: {
            id: params.id,
          },
        });
        break;
      } catch (error) {
        console.error(`数据库连接失败，剩余重试次数: ${retries - 1}`);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!recipe) {
      return NextResponse.json(
        { error: "菜谱不存在" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("获取菜谱详情失败:", error);
    return NextResponse.json(
      { error: "获取菜谱详情失败" },
      {
        status: 500,
      }
    );
  }
}