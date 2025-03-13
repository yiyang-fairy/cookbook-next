'use client';

import { useEffect, useState, useRef } from 'react';
import Flex from "@/components/Flex";
import { Toast, NavBar, Button, FloatingBubble, Tabs, Popup, Checkbox } from "antd-mobile";
import LuckyTurnTable from "@/components/LuckyTurntable";
import settingIcon from '/public/imgs/setting.gif';
import { RecipeType, Recipe, typeMap } from "@/types/recipe";
import ApiClient from "@/lib/api-client";
import { CloseOutline } from "antd-mobile-icons";
import ImagesCloud from "@/components/ImagesCloud";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import 'animate.css/animate.min.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface TurntableData {
  id: string;
  name: string;
  img: string;
}

export default function TurntablePage() {

  const [selectedItem, setSelectedItem] = useState<TurntableData | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [popupType, setPopupType] = useState<RecipeType>(RecipeType.ALL);
  const [turntableData, setTurntableData] = useState<TurntableData[]>([]);
  const [showTurntable, setShowTurntable] = useState(true);
  const router = useRouter();

  const confettiRef = useRef<ConfettiRef>(null);

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  const turntableStart = () => {
    console.log('开始抽奖');
    setSelectedItem(null);
  };

  const turntableEnd = (prize: any) => {
    console.log('抽奖结束', prize);
    setShowCelebration(true);
    setSelectedItem(prize);
    setIsLeaving(false);

    setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 1500);
    }, 3000);
  };

  const getDefaultItems = async () => {
    const data = await ApiClient.get<Recipe[]>(
      '/api/menu-prisma',
      { type: RecipeType.ALL },
      (data): data is Recipe[] => Array.isArray(data)
    ) || [];

    setTurntableData(data.slice(0, 5).map(recipe => ({ name: recipe.name, img: recipe.cover_image, id: recipe.id })));
  }

  const handleRecipeClick = (recipeId: string) => {
    const recipe = selectedRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipes(prev => prev.filter(r => r.id !== recipeId));
    } else {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        setSelectedRecipes(prev => [...prev, recipe]);
      }
    }
  };

  const getRecipes = async (type: RecipeType) => {
    const data = await ApiClient.get<Recipe[]>(
      '/api/menu-prisma',
      { type: type },
      (data): data is Recipe[] => Array.isArray(data)
    );
    setRecipes(data || []);
  };

  const finish = () => {
    if (selectedRecipes.length < 2) {
      Toast.show('请至少选择2个菜品');
      return;
    }
    if (selectedRecipes.length > 5) {
      Toast.show('菜品数量过多, 将以图片云形式展示');
      setShowTurntable(false);
    }

    setTurntableData(selectedRecipes.map(recipe => ({ name: recipe.name, img: recipe.cover_image, id: recipe.id })));
    setVisible(false);
    setSelectedItem(null);
  }

  const handleCategorySelect = (type: RecipeType) => {
    // 获取当前分类下的所有菜品（从全部菜品中筛选）
    const recipesInCategory = type === RecipeType.ALL 
      ? allRecipes  // 如果是全部分类，使用所有菜品
      : allRecipes.filter(recipe => recipe.type === type);  // 否则只过滤当前类型的菜品
    
    // 检查当前分类下的菜品是否全部被选中
    const allSelected = recipesInCategory.length > 0 && recipesInCategory.every(recipe => 
      selectedRecipes.some(r => r.id === recipe.id)
    );

    if (allSelected) {
      // 如果全部选中，则取消当前分类下所有菜品的选择
      setSelectedRecipes(prev => 
        prev.filter(recipe => !recipesInCategory.some(r => r.id === recipe.id))
      );
    } else {
      // 如果未全部选中，则添加当前分类下所有未选中的菜品
      const newRecipes = recipesInCategory.filter(recipe => 
        !selectedRecipes.some(r => r.id === recipe.id)
      );
      setSelectedRecipes(prev => [...prev, ...newRecipes]);
    }
  };

  const isCategorySelected = (type: RecipeType) => {
    // 获取当前分类下的所有菜品（从全部菜品中筛选）
    const recipesInCategory = type === RecipeType.ALL 
      ? allRecipes  // 如果是全部分类，使用所有菜品
      : allRecipes.filter(recipe => recipe.type === type);  // 否则只过滤当前类型的菜品
    
    // 检查是否所有菜品都被选中
    return recipesInCategory.length > 0 && 
      recipesInCategory.every(recipe => 
        selectedRecipes.some(r => r.id === recipe.id)
      );
  };

  useEffect(() => {
    getDefaultItems();
  }, []);

  useEffect(() => {
    getRecipes(popupType);
  }, [popupType]);

  useEffect(() => {
    const getAllRecipes = async () => {
      const data = await ApiClient.get<Recipe[]>(
        '/api/menu-prisma',
        { type: RecipeType.ALL },
        (data): data is Recipe[] => Array.isArray(data)
      );
      setAllRecipes(data || []);
    };
    getAllRecipes();
  }, []);

  return (
    <Flex className="h-screen w-screen" direction="column" alignItems="center" >
      <NavBar
        className="w-full"
        onBack={() => router.back()}
        style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
      >
        今天吃什么?
      </NavBar>

      {/* 抽奖内容 */}
      <Flex className="w-full p-4 py-10" direction="column" alignItems="center">
        <Flex justify="center" >
          {showTurntable
            ? <LuckyTurnTable prizes={turntableData} onEnd={turntableEnd} onStart={turntableStart} />
            : <ImagesCloud data={turntableData} onEnd={turntableEnd} onStart={turntableStart} />}
        </Flex>

        {selectedItem && !showCelebration && (
          <Link href={`/detail/${selectedItem.id}`} className="flex mt-12 w-2/3 bg-[#ff6b6b] justify-center items-center px-4 py-3 rounded-lg text-nowrap">
            <span className='text-xl font-bold text-white'>今天吃：</span>
            <SparklesText text={selectedItem.name} />
          </Link>
        )}

      </Flex>

      {/* 庆祝动画 */}
      {
        showCelebration && (
          <Flex style={{ position: "fixed" }} className={`animate__animated ${isLeaving ? 'animate__backOutDown' : 'animate__fadeInDownBig'} w-screen h-screen fixed top-0 left-0 z-10`} justify="center" alignItems="center">

            <Flex>
              <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br p-6 from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-2xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  🎉 抽中了：{selectedItem?.name}
                </span>
              </NeonGradientCard>
            </Flex>
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full "
              onMouseEnter={() => {
                confettiRef.current?.fire({});
              }}
            /></Flex>
        )
      }


      {/* 设置按钮 */}
      <FloatingBubble
        style={{
          '--initial-position-bottom': '80px',
          '--initial-position-left': '42px',
          '--edge-distance': '24px',
          '--background': '#ff6b6b',
          'height': '0'
        }}
        offset={{ x: -10, y: -250 }}
        onClick={() => {
          setVisible(true)
        }}
      >
        <img src={settingIcon.src} alt="设置" className="" />
      </FloatingBubble>

      {/* 设置弹窗 */}
      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
        bodyStyle={{ height: '60vh' }}
        className="rounded-t-2xl w-full"
      >
        <Flex direction="column" className="h-full w-full bg-white">
          {/* 顶部标题栏 */}
          <Flex justify="space-between" alignItems="center" className="px-4 py-2 border-b border-gray-100 w-full sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <CloseOutline className="text-gray-500 text-lg cursor-pointer hover:text-gray-700 transition-colors" onClick={() => setVisible(false)} />
            <Flex className="text-base font-medium">随机池内容</Flex>
            <Flex 
              onClick={() => finish()} 
              className="bg-[#ff6b6b] text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-[#ff5252] transition-colors active:scale-95 transform"
            >
              完成
            </Flex>
          </Flex>
          
          <Flex direction="column" className="flex-1 overflow-hidden w-full">
            {/* 已选择区域 - 固定在顶部 */}
            <Flex direction="column" className="border-b border-gray-100 px-4 py-2 w-full bg-white/80 backdrop-blur-sm">
              <Flex justify="space-between" alignItems="center" className="mb-1.5 w-full">
                <span className="text-gray-600 text-sm font-medium">已选择 ({selectedRecipes.length})</span>
                {selectedRecipes.length > 0 && (
                  <Button 
                    size="mini"
                    className="!text-[#ff6b6b] !border-none hover:!text-[#ff5252] hover:!bg-red-50 transition-colors text-xs"
                    onClick={() => setSelectedRecipes([])}
                  >
                    清空
                  </Button>
                )}
              </Flex>
              <div className="flex flex-wrap gap-1.5 max-h-[12vh] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-1">
                {selectedRecipes.map(recipe => (
                  <Flex 
                    key={recipe.id}
                    className="bg-red-50 hover:bg-red-100 px-2 py-1 rounded-full items-center cursor-pointer transition-colors group"
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <img 
                      src={recipe.cover_image} 
                      alt={recipe.name} 
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <div className="mx-1.5 text-xs text-gray-700">{recipe.name}</div>
                    <CloseOutline className="text-gray-400 w-3 h-3 group-hover:text-gray-600" />
                  </Flex>
                ))}
              </div>
            </Flex>

            {/* 菜品选择区域 */}
            <Tabs 
              defaultActiveKey="ALL"
              style={{ 
                width: '100%',
                '--fixed-active-line-width': '100%',
                '--active-line-height': '1px',
                '--active-line-color': '#ff6b6b',
                '--active-title-color': '#ff6b6b',
                '--title-font-size': '13px',
                '--content-padding': '8px',
              }} 
              onChange={(key) => {
                setPopupType(key as RecipeType);
              }}
              className="flex-1"
            >
              {Object.entries(typeMap).map(([key, title]) => (
                <Tabs.Tab 
                  key={key} 
                  title={
                    <Flex alignItems="center" className="gap-1.5">
                      <Checkbox
                        style={{
                          '--font-size': '13px',
                          '--icon-size': '14px',
                          '--gap': '4px',
                        }}
                        checked={isCategorySelected(key as RecipeType)}
                        onChange={() => handleCategorySelect(key as RecipeType)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">{title}</span>
                    </Flex>
                  }
                >
                  <div className="grid grid-cols-4 gap-1.5 p-2 overflow-y-auto">
                    {recipes.map(recipe => (
                      <Flex 
                        key={recipe.id} 
                        direction="column"
                        alignItems="center"
                        onClick={() => handleRecipeClick(recipe.id)}
                        className={`p-1 rounded-md border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                          selectedRecipes.some(r => r.id === recipe.id) 
                            ? 'border-[#ff6b6b] bg-red-50' 
                            : 'border-gray-100 hover:border-[#ff6b6b]/30 hover:bg-red-50/30'
                        }`}
                      >
                        <img 
                          src={recipe.cover_image} 
                          alt={recipe.name} 
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div className="mt-0.5 text-xs text-gray-700 text-center break-words w-full leading-[1.1] line-clamp-2">{recipe.name}</div>
                      </Flex>
                    ))}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs>
          </Flex>
        </Flex>
      </Popup>


    </Flex>
  );
} 