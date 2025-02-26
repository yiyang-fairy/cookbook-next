import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
import { createErrorResponse } from '@/lib/api-utils';


export async function POST(request: Request) {
  try { 
    const {id} = await request.json();
    
    if (!id) {
      return createErrorResponse("缺少必要的删除参数", 400);
    }

    const result = await prisma.recipes.delete({
      where: {id}
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return createErrorResponse("删除失败", 500, error as Error);
  }
} 

