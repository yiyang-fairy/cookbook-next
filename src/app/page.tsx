"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SideBar, Image } from "antd-mobile";
import { Recipe, RecipeType, typeMap } from "@/types/recipe";

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<RecipeType>(RecipeType.ALL);
  const [loadingType, setLoadingType] = useState<RecipeType | null>(null);

  const fetchRecipes = async (type: RecipeType) => {
    try {
      setLoadingType(type);
      const response = await fetch(`/api/menu?type=${activeKey}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("返回数据格式错误");
      }

      setRecipes(data);
    } catch (error) {
      console.error("获取菜单失败:", error);
      setRecipes([]); // 出错时清空数据
      // 可以添加一个 toast 提示
      if (typeof window !== "undefined") {
        alert(error instanceof Error ? error.message : "获取菜单失败");
      }
    } finally {
      setLoadingType(null);
      setLoading(false);
    }
  };

  const insertData = () => {
    console.log("开始批量上传菜单数据");
    const menuData = [
      {
        name: "红烧排骨",
        type: "MEAT",
        ingredients: ["排骨", "生抽", "老抽", "料酒", "八角", "葱", "姜", "蒜"],
        cooking_time: 45,
        steps: [
          "排骨切段，冷水下锅焯水",
          "锅中放油，爆香葱姜蒜",
          "放入排骨翻炒上色",
          "加入调料，倒入适量热水",
          "大火烧开后转小火炖煮30分钟",
          "收汁即可出锅"
        ],
        selected_count: 0
      },
      {
        name: "清炒菜心",
        type: "VEGETABLE",
        ingredients: ["菜心", "蒜", "盐", "生抽"],
        cooking_time: 10,
        steps: [
          "菜心洗净切段",
          "锅中放油，爆香蒜末",
          "放入菜心快速翻炒",
          "加入适量盐和生抽调味",
          "大火快炒至断生即可"
        ],
        selected_count: 0
      },
      {
        name: "番茄炒蛋",
        type: "MIXED",
        ingredients: ["番茄", "鸡蛋", "葱花", "盐"],
        cooking_time: 15,
        steps: [
          "番茄切块，鸡蛋打散",
          "锅中放油，炒散鸡蛋盛出",
          "同一锅中炒番茄",
          "番茄软化后加入鸡蛋",
          "加盐调味，撒上葱花即可"
        ],
        selected_count: 0
      }
    ];

    fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("上传成功:", data);
        alert("菜单数据上传成功！");
        // 刷新菜单列表
        fetchRecipes(activeKey);
      })
      .catch((error) => {
        console.error("上传失败:", error);
        alert("菜单数据上传失败，请重试");
      });
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
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
          </div>
        </div>
      </div>

      <div onClick={insertData} className=" w-10 h-20 bg-red-700 text-white">
        insert
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
