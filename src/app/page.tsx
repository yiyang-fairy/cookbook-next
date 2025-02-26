"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SideBar, Image } from "antd-mobile";
import { Recipe, RecipeType, typeMap } from "@/types/recipe";
import ApiClient from '@/lib/api-client';
import Flex from "@/components/Flex";
import { AddCircleOutline } from "antd-mobile-icons";
import { useRouter } from 'next/navigation';

// 修改轮播图数据的 id 格式
const swiperItems = [
  {
    id: "swiper_1", // 修改为字符串格式，添加前缀
    image:
      "https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    title: "轮播图1",
  },
  {
    id: "swiper_2",
    image:
      "https://images.unsplash.com/photo-1601128533718-374ffcca299b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3128&q=80",
    title: "轮播图2",
  },
  {
    id: "swiper_3",
    image:
      "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
    title: "轮播图3",
  },
];

export default function Home() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<RecipeType>(RecipeType.ALL);
  const [loadingType, setLoadingType] = useState<RecipeType | null>(null);

  const fetchRecipes = async (type: RecipeType) => {
    try {
      setLoadingType(type);
      const data = await ApiClient.get<Recipe[]>(
        '/api/menu-prisma',
        { type: activeKey },
        (data): data is Recipe[] => Array.isArray(data)
      );
      
      setRecipes(data || []);
    } finally {
      setLoadingType(null);
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchRecipes(RecipeType.ALL);
  }, []);

  // 切换类型时加载
  useEffect(() => {
    if (!loading) {
      fetchRecipes(activeKey);
    }
  }, [activeKey, loading]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        加载中...
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      {/* 轮播图 */}
      <div className="h-[200px]">
        {" "}
        {/* 给定固定高度 */}
        <Swiper autoplay loop style={{ height: "100%" }}>
          {swiperItems.map((item) => (
            <Swiper.Item key={item.id}>
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  fit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  alt={item.title}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white p-2">
                  {item.title}
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <SideBar
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key as RecipeType)}
          style={{
            "--background-color": "transparent",
          }}
        >
          {Object.entries(typeMap).map(([key, value]) => (
            <SideBar.Item key={key} title={value} />
          ))}
        </SideBar>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-4 relative">
            {loadingType && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                加载中...
              </div>
            )}
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/detail/${recipe.id}`}
                className="p-4 drop-shadow-xl rounded-lg bg-white transition-colors"
              >
                <h2 className="text-lg font-semibold">{recipe.name}</h2>
                <p className="text-gray-600">
                  烹饪时间: {recipe.cookingTime}分钟
                </p>
                <p className="text-gray-600">
                  已被选择: {recipe.selectedCount}次
                </p>
                <p className="text-sm text-gray-400">
                  更新时间: {recipe.updateTime}
                </p>
              </Link>
            ))}
            <Flex onClick={() => router.push('/edit')} alignItems="center" justify="center"> 
              <AddCircleOutline /> 添加菜谱
            </Flex>
          </div>
        </div>
      </div>

      {/* 转盘按钮 */}
      <Link
        href="/turntable"
        className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
      >
        抽奖转盘
      </Link>
    </main>
  );
}
