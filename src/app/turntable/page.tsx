'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Flex from "@/components/Flex";
import { Toast, NavBar, Button, FloatingBubble, Tabs, Popup } from "antd-mobile";
import LuckyTurnTable from "@/components/LuckyTurnTable";
import settingIcon from '/public/imgs/setting.gif';
import { RecipeType, Recipe, typeMap } from "@/types/recipe";
import ApiClient from "@/lib/api-client";
import { CloseOutline } from "antd-mobile-icons";
import ImagesCloud from "@/components/ImagesCloud";

const defaultItems = [{
  name: '红烧肉',
  img: './imgs/jack.png'
}, {
  name: '酸辣白菜',
  img: './imgs/jenny.png'
}, {
  name: '宫保鸡丁',
  img: './imgs/jill.png'
}];

export interface TurntableData {
  name: string;
  img: string;
}

export default function TurntablePage() {

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [popupType, setPopupType] = useState<RecipeType>(RecipeType.ALL);
  const [turntableData, setTurntableData] = useState<TurntableData[]>(defaultItems);
  const [showTurntable, setShowTurntable] = useState(true);

  const turntableStart = () => {
    console.log('开始抽奖');
    setSelectedItem(null);
  };

  const turntableEnd = (prize: any) => {
    setSelectedItem(prize.fonts[0].text);
    setShowPopup(true);
    setIsLeaving(false);


    setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    }, 2000);
  };

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
    if(selectedRecipes.length > 20) {
      Toast.show('菜品数量过多, 将以图片云形式展示');
      setShowTurntable(false);
    } 

    setTurntableData(selectedRecipes.map(recipe => ({ name: recipe.name, img: recipe.cover_image })));
    setVisible(false);
    setSelectedItem(null);
  }

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

      <Flex className="w-full p-4 py-10" direction="column" alignItems="center">
        <Flex justify="center" >
          {showTurntable
            ? <LuckyTurnTable prizes={turntableData} onEnd={turntableEnd} onStart={turntableStart} />
            : <ImagesCloud data={turntableData} onEnd={turntableEnd} onStart={turntableStart}/>}
        </Flex>

        {/* <div className="min-h-[400px] flex items-center justify-center">
          {typeof window !== 'undefined' && <IconCloud icons={icons} />}
        </div> */}

        {selectedItem && (
          <Flex className="mt-12 w-2/3 bg-[#ff6b6b] justify-center items-center px-4 py-3 rounded-lg text-nowrap" justify="center" alignItems="center">
            <span className='text-xl font-bold text-white'>今天吃：</span>
            <span className='text-2xl font-bold text-yellow-300'>{selectedItem}</span>
          </Flex>
        )}

      </Flex>


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
        <img src={settingIcon.src} alt="设置"  className=""/>
      </FloatingBubble>

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
            <CloseOutline />
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
                        <img  src={recipe.cover_image} alt={recipe.name} className=" w-8 h-8 round" />
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
                <Flex  key={recipe.id}>
                  <img  src={recipe.cover_image} alt={recipe.name}  className=" w-8 h-8 round"/>
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