"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { NavBar, Space, Image, Dialog, Toast, ImageViewer } from "antd-mobile";
import Flex from "@/components/Flex";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";
import ApiClient from '@/lib/api-client';
import { useRouter } from "next/navigation";
import loadingIcon from '/public/imgs/loading.gif';

interface RecipeDetailProps {
  id: string;
}

export default function RecipeDetail({ id }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [viewImagesVisible, setViewImagesVisible] = useState(false);
  const [viewImagesIndex, setViewImagesIndex] = useState(0);
  const [viewImages, setViewImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await ApiClient.get<Recipe>('/api/menu-prisma', { id: id });
        if (data) {
          setRecipe(data);
        }
      } catch (error) {
        console.error("获取菜谱详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" alignItems="center" className="h-screen w-screen">
        <img src={loadingIcon.src} alt="加载中" className="w-10 h-10" />
      </Flex>);
  }

  if (!recipe) {
    return <Flex>未找到菜谱</Flex>;
  }

  const handleEdit = () => {
    localStorage.setItem('editRecipe', JSON.stringify(recipe));
    router.push('/edit');
  };

  const handleDelete = () => {
    Dialog.confirm({
      content: '是否删除菜谱',
      onConfirm: async () => {
        console.log("删除", id);
        await ApiClient.post('/api/menu-prisma/delete', { id: id });
        Toast.show({
          icon: 'success',
          content: '提交成功',
          position: 'bottom',
        })
        router.push('/');
      },
    })
  };

  return (
    <Flex direction="column" className="h-screen w-screen">
      {/* 顶部导航栏 */}
      <NavBar
        onBack={() => window.history.back()}
        right={
          <Space style={{ fontSize: 24 }}>
            <EditSOutline onClick={handleEdit} />
            <DeleteOutline onClick={handleDelete} />
          </Space>
        }
        style={{ backgroundColor: '#ff6b6b', color: '#fff', width: '100%' }}
      >
        {recipe.name}
      </NavBar>
      <Flex direction="column" className="p-4 overflow-auto flex-1 w-full ">
        <Flex className="w-full h-[160px] mb-3 drop-shadow-xl rounded-md">
          <Image
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            className="rounded-md mb-3 drop-shadow-xl"
            src={recipe.cover_image || `https://picsum.photos/800/400?random=${recipe.id}`}
            alt="菜谱图片"
            onClick={() => {
              setViewImagesVisible(true)
              setViewImagesIndex(0)
              setViewImages([recipe.cover_image])
            }}
          />
        </Flex>
        {/* 菜品信息 */}
        <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md w-full">
          <Flex className="text-xl font-bold mb-2">{recipe.name}</Flex>
          <Flex justify="space-between" alignItems="center">
            <span className="text-gray-500">烹饪时间 {recipe.cooking_time}分钟</span>
          </Flex>
        </Flex>

        {/* 食材清单 */}
        <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md w-full">
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

        {/* 教学视频/图片 */}
        {
          (recipe.stepVideo.length > 0 || recipe.stepImages.length > 0) && (
            <Flex direction="column" className="bg-white p-4 drop-shadow-xl rounded-md w-full">
              <h3 className="text-lg font-bold mb-2">教程</h3>
              <Flex direction="column" className="space-y-4">
                {recipe.stepType === 'VIDEO' ? (
                  <video src={recipe.stepVideo[0]} controls />
                ) : (
                  <Flex>
                    {recipe.stepImages.map((image, index) => (
                      <Image key={index} src={image} alt="教学图片" onClick={() => {
                        setViewImagesVisible(true)
                        setViewImagesIndex(index)
                        setViewImages(recipe.stepImages)
                      }} />
                    ))}
                  </Flex>
                )}
              </Flex>
            </Flex>
          )
        }
        {/* 烹饪步骤 */}
        <Flex direction="column" className="bg-white p-4 drop-shadow-xl rounded-md w-full">
          <h3 className="text-lg font-bold mb-2">烹饪步骤</h3>
          <Flex direction="column" className="space-y-4">
            {recipe.steps?.map((step, index) => (
              <Flex key={index} className="flex items-center gap-4">
                <Flex className="w-6 h-6 bg-[#ff6b81] text-white rounded-full" alignItems="center" justify="center">
                  {index + 1}
                </Flex>
                <p>{step}</p>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <ImageViewer.Multi
        images={viewImages}
        visible={viewImagesVisible}
        defaultIndex={viewImagesIndex}
        onClose={() => {
          setViewImagesVisible(false)
        }}
      />
    </Flex>
  );
} 