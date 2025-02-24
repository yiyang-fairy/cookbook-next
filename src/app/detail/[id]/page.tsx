'use client';

import { recipes } from '@/data/recipes';
import { NavBar, Image, Tag, Button, Space, Toast } from 'antd-mobile';
import { 
  ClockCircleFill,
  StarFill,
  StarOutline,
  LinkOutline,
  EditSOutline,
  DeleteOutline 
} from 'antd-mobile-icons';
import { useParams, useRouter } from "next/navigation";
import { useState } from 'react';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // const recipe = recipes.find(r => r.id === id);
  const recipe = {
    id: 1,
    name: '宫保鸡丁',
    cookingTime: 30,
    selectedCount: 100,
    updateTime: '2024-01-01',
    ingredients: ['鸡胸肉', '花生米', '辣椒', '葱姜蒜'],
    steps: ['鸡胸肉切丁', '花生米炒香', '辣椒炒香', '葱姜蒜炒香']
  }
  const [isFavorite, setIsFavorite] = useState(false);

  if (!recipe) {
    return <div>菜品不存在</div>;
  }

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Toast.show({
      content: isFavorite ? '已取消收藏' : '已收藏',
      position: 'bottom',
    });
  };

  const handleShare = () => {
    Toast.show({
      content: '分享功能开发中',
      position: 'bottom',
    });
  };

  const handleEdit = () => {
    Toast.show({
      content: '编辑功能开发中',
      position: 'bottom',
    });
  };

  const handleDelete = () => {
    Toast.show({
      content: '删除功能开发中',
      position: 'bottom',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[url('/imgs/food005.jpg')] bg-center bg-no-repeat bg-cover">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <NavBar 
          onBack={handleBack}
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
      </div>
      
      <div className="flex-1 overflow-y-auto mt-[45px]">
        <div className="p-4">
          {/* 主图 */}
          <div className="-mx-4 -mt-4 mb-4">
            <Image
              alt={recipe.name}
              src={`https://picsum.photos/800/400?random=${recipe.id}`}
              fit='cover'
              className="w-full h-[200px] object-cover"
            />
          </div>

          {/* 基本信息 */}
          <div className="bg-[#fffbfb] p-4 rounded-lg mb-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold m-0">{recipe.name}</h1>
              <Space className="[&_.adm-button]:bg-transparent [&_.adm-button]:border-transparent [&_.adm-button]:text-2xl [&_.adm-button]:p-1 [&_.adm-button:hover]:bg-black/5">
                <Button onClick={handleFavorite}>
                  {isFavorite ? <StarFill /> : <StarOutline />}
                </Button>
                <Button onClick={handleShare}>
                  <LinkOutline />
                </Button>
              </Space>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Tag color='primary'>
                <Space align='center'>
                  <ClockCircleFill />
                  {recipe.cookingTime}分钟
                </Space>
              </Tag>
              <Tag color='success'>已被选择: {recipe.selectedCount || 0}次</Tag>
              {recipe.updateTime && (
                <Tag color='default'>更新时间: {recipe.updateTime}</Tag>
              )}
            </div>
          </div>

          {/* 食材清单 */}
          <div className="bg-[#fffbfb] p-4 rounded-lg mb-4 shadow-lg">
            <h2 className="text-lg font-bold m-0 mb-4 pl-3 border-l-4 border-[#ff6b6b]">食材清单</h2>
            <div className="flex gap-2 flex-wrap">
              {recipe.ingredients.map((ingredient, index) => (
                <Tag key={index} className="text-sm" color='primary' fill='outline'>
                  {ingredient}
                </Tag>
              ))}
            </div>
          </div>

          {/* 烹饪步骤 */}
          <div className="bg-[#fffbfb] p-4 rounded-lg mb-4 shadow-lg">
            <h2 className="text-lg font-bold m-0 mb-4 pl-3 border-l-4 border-[#ff6b6b]">烹饪步骤</h2>
            <div className="flex flex-col gap-4">
              {recipe.steps?.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-6 h-6 bg-[#ff6b6b] text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-base leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 教学视频 */}
          {/* {recipe?.video && (
            <div className="bg-[#fffbfb] p-4 rounded-lg mb-4 shadow-lg">
              <h2 className="text-lg font-bold m-0 mb-4 pl-3 border-l-4 border-[#ff6b6b]">教学视频</h2>
              <div className="w-full rounded-lg overflow-hidden">
                <video
                  src={recipe?.video}
                  controls
                  className="w-full block"
                  poster={`https://picsum.photos/800/400?random=${recipe.id}_video`}
                />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
} 