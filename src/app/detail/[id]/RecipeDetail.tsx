"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { NavBar, Space, Image } from "antd-mobile";
import Flex from "@/components/Flex";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";

interface RecipeDetailProps {
  id: string;
}

export default function RecipeDetail({ id }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/menu-prisma/${id}`);
        if (!response.ok) {
          throw new Error("获取菜谱详情失败");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("获取菜谱详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <Flex>加载中...</Flex>;
  }

  if (!recipe) {
    return <Flex>未找到菜谱</Flex>;
  }

  const handleEdit = () => {
    console.log("编辑");
  };

  const handleDelete = () => {
    console.log("删除");
  };

  return (
    <Flex direction="column" className="h-screen">
      {/* 顶部导航栏 */}
      <NavBar
          onBack={() => window.history.back()}
          right={
            <Space style={{ fontSize: 24 }}>
              <EditSOutline onClick={handleEdit} />
              <DeleteOutline onClick={handleDelete} />
            </Space>
          }
          style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
        >
          {recipe.name}
        </NavBar>
      <Flex direction="column" className="p-4 overflow-auto flex-1">
        <Image
          className="rounded-md mb-3 drop-shadow-xl w-full h-40"
          src={`https://picsum.photos/800/400?random=${recipe.id}`} 
          fit='cover'
          alt="菜谱图片"/>
        {/* 菜品信息 */}
        <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md">
          <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
          <Flex justify="space-between" alignItems="center">
            <span className="text-gray-500">烹饪时间 {recipe.cookingTime}分钟</span>
            <span className="text-gray-500">已被选择 {recipe.selectedCount}次</span>
          </Flex>
        </Flex>

        {/* 食材清单 */}
        <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md">
          <h3 className="text-lg font-bold mb-2">食材清单</h3>
          <Flex className="flex flex-wrap gap-2">
            {recipe.ingredients?.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </Flex>
        </Flex>

        {/* 烹饪步骤 */}
        <Flex direction="column" className="bg-white p-4 drop-shadow-xl rounded-md">
          <h3 className="text-lg font-bold mb-2">烹饪步骤</h3>
          <Flex direction="column" className="space-y-4">
            {recipe.steps?.map((step, index) => (
              <Flex key={index} className="flex items-center gap-4">
                <Flex className="w-6 h-6 bg-[#ff6b81] text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </Flex>
                <p>{step}</p>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
} 