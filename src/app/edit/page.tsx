"use client";

import { NavBar, Input, Button, TextArea, Form, Radio, Toast } from "antd-mobile";
import Flex from "@/components/Flex";
import ImageUploader from '@/components/ImageUploader';
import { RecipeType, typeMap } from '@/types/recipe';
import ApiClient from '@/lib/api-client';
import { useState, useEffect } from "react";
import type { recipes } from '@prisma/client';

interface RecipeForm {
  name: string;
  cover: string;
  type: RecipeType;
  cookTime: number;
  ingredients: string;
  steps: string;
}

export default function RecipeDetail() {
  const [form] = Form.useForm<RecipeForm>();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Partial<recipes>>({});

  // 在客户端加载时获取数据
  useEffect(() => {
    const savedRecipe = localStorage.getItem('editRecipe');
    if (savedRecipe) {
      const parsedRecipe = JSON.parse(savedRecipe);
      setRecipe(parsedRecipe);
      
      // 设置表单初始值
      form.setFieldsValue({
        name: parsedRecipe.name,
        cover: parsedRecipe.cover_image,
        type: parsedRecipe.type,
        cookTime: parsedRecipe.cooking_time,
        ingredients: parsedRecipe.ingredients?.join('\n'),
        steps: parsedRecipe.steps?.join('\n'),
      });
    }
  }, [form]);
  
  // 添加组件卸载时的清理
  useEffect(() => {
    return () => {
      localStorage.removeItem('editRecipe');
    };
  }, []);

  const onFinish = async (values: RecipeForm) => {
    setLoading(true);
    Toast.show({
      icon: 'loading',
      content: '保存中...',
      duration: 0,
    });

    try {
      const postData: Partial<recipes> = {
        ...(recipe.id && { id: recipe.id }),
        name: values.name.trim(),
        type: values.type as recipes['type'],
        ingredients: values.ingredients
          .split('\n')
          .map(i => i.trim())
          .flatMap(i => i.split(','))
          .map(i => i.trim())
          .filter(i => i.length > 0),
        cooking_time: Math.max(1, Number(values.cookTime)),
        steps: values.steps
          ? values.steps.split('\n').map(s => s.trim()).filter(s => s.length > 0)
          : ['暂无步骤'],
        cover_image: values.cover,
      };

      const savedRecipe: recipes = (await ApiClient.post('/api/menu-prisma', postData))!;
      if (savedRecipe) {
        Toast.show({
          icon: 'success',
          content: '保存成功',
        });
        // 保存成功后返回上一页
        window.history.back();
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: error instanceof Error ? error.message : '保存失败',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" className="h-screen">
      {/* 顶部导航栏 */}
      <NavBar
        onBack={() => window.history.back()}
        style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
      >
        编辑菜谱
      </NavBar>
      <Flex direction="column" className="p-4 overflow-auto flex-1">
        <Form
          form={form}
          onFinish={onFinish}
          layout='horizontal'
          footer={
            <Button 
              block 
              type='submit' 
              color='primary' 
              size='large'
              loading={loading}
              disabled={loading}
            >
              保存菜谱
            </Button>
          }
        >
          {/* 基本信息 */}
          <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md">
            <h2 className="text-xl font-bold mb-2">基本信息</h2>
            <Form.Item
              name="name"
              label="菜品名称"
              rules={[{ required: true, message: '请输入菜品名称' }]}
            >
              <Input placeholder="请输入菜品名称" />
            </Form.Item>
            <Form.Item
              name="cover"
              label="封面图片"
              rules={[{ required: true, message: '请输入封面图片' }]}
            >
              <ImageUploader />
            </Form.Item>
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请输入菜品类型' }]}
            >
              <Radio.Group>
                {
                  Object.entries(typeMap).map(([key, value]) => (
                    <Radio key={key} value={key}>{value}</Radio>
                  ))
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="cookTime"
              label="烹饪时间"
              rules={[{ required: true, message: '请输入烹饪时间' }]}
            >
              <Input type="number" placeholder="请输入烹饪时间（分钟）" />
            </Form.Item>
          </Flex>

          {/* 食材清单 */}
          <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md">
            <h3 className="text-lg font-bold mb-2">食材清单</h3>
            <Form.Item
              name="ingredients"
              rules={[{ required: true, message: '请输入食材清单' }]}
            >
              <TextArea
                placeholder="请输入食材清单，每行一个食材"
                rows={4}
                className="w-full"
              />
            </Form.Item>
          </Flex>

          {/* 烹饪步骤 */}
          <Flex direction="column" className="bg-white p-4 drop-shadow-xl rounded-md">
            <h3 className="text-lg font-bold mb-2">烹饪步骤</h3>
            <Form.Item
              name="steps"
              rules={[{ required: true, message: '请输入烹饪步骤' }]}
            >
              <TextArea
                placeholder="请输入烹饪步骤，每个步骤一行"
                rows={6}
                className="w-full"
              />
            </Form.Item>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
} 