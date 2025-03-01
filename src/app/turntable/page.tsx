'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Flex from "@/components/Flex";
import { Toast, NavBar, Button, FloatingBubble, Tabs, Popup } from "antd-mobile";
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

  const confettiRef = useRef<ConfettiRef>(null);

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
    if (selectedRecipes.length > 5) {
      Toast.show('菜品数量过多, 将以图片云形式展示');
      setShowTurntable(false);
    }

    setTurntableData(selectedRecipes.map(recipe => ({ name: recipe.name, img: recipe.cover_image, id: recipe.id })));
    setVisible(false);
    setSelectedItem(null);
  }

  useEffect(() => {
    getDefaultItems();
  }, []);

  useEffect(() => {
    getRecipes(popupType);
  }, [popupType]);

  

  return (
    <Flex className="h-screen w-screen" direction="column" alignItems="center" >
      <NavBar
        className="w-full"
        onBack={() => window.history.back()}
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
        onMaskClick={() => {
          setVisible(false)
        }}
        onClose={() => {
          setVisible(false)
        }}
        bodyStyle={{ height: '60vh' }}
      >
        <Flex direction='column' className="h-full w-full">
          <Flex justify="space-between" alignItems="center">
            <CloseOutline onClick={() => setVisible(false)} />
            <Flex> 随机池内容</Flex>
            <Button onClick={() => finish()}  >完成</Button>
          </Flex>
          <Flex>
            <Tabs defaultActiveKey='ALL' style={{ width: '100%' }} onChange={(key) => {
              setPopupType(key as RecipeType);
            }}>
              {Object.entries(typeMap).map(([key, title]) => (
                <Tabs.Tab key={key} title={title} >
                  <Flex>
                    {recipes.map(recipe => (
                      <Flex key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                        <img src={recipe.cover_image} alt={recipe.name} className=" w-8 h-8 round" />
                        <div >{recipe.name}</div>
                      </Flex>
                    ))}
                  </Flex>
                </Tabs.Tab>
              ))}
            </Tabs>

          </Flex>
          <Flex>
            <Flex>
              已选择:
            </Flex>
            <Flex wrap='wrap' style={{ flex: 1 }}>
              {selectedRecipes.map(recipe => (
                <Flex key={recipe.id}>
                  <img src={recipe.cover_image} alt={recipe.name} className=" w-8 h-8 round" />
                  <div >{recipe.name}</div>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Popup>


    </Flex>
  );
} 