"use client";

import { NavBar, Input, Button, TextArea, Form, Radio, Toast, Space } from "antd-mobile";
import { AddOutline, CloseOutline } from 'antd-mobile-icons';
import Flex from "@/components/Flex";
import ImageUploader from '@/components/ImageUploader';
import { RecipeType, typeMap } from '@/types/recipe';
import ApiClient from '@/lib/api-client';
import { useState, useEffect } from "react";
import type { recipes } from '@prisma/client';

interface Ingredient {
  name: string;
  amount: string;
}

interface RecipeForm {
  name: string;
  cover: string;
  type: RecipeType;
  cookTime: number;
  ingredients: Ingredient[];
  steps: string[];
  stepType: 'video' | 'image';
  stepVideo?: string[];
  stepImages?: string[];
}

export default function RecipeDetail() {
  const [form] = Form.useForm<RecipeForm>();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Partial<recipes>>({});
  const [cookingSteps, setCookingSteps] = useState<string[]>(['']);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', amount: '' });

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
        stepType: parsedRecipe.stepType || 'video',
      });

      // 设置食材列表
      if (parsedRecipe.ingredients && parsedRecipe.ingredients.length > 0) {
        // 将字符串数组转换为带数量的食材对象数组
        const ingredientList = parsedRecipe.ingredients.map((item: string) => {
          const [name, amount = '适量'] = item.split(',');
          return { name: name.trim(), amount: amount.trim() };
        });
        setIngredients(ingredientList);
      }

      // 设置烹饪步骤
      if (parsedRecipe.steps && parsedRecipe.steps.length > 0) {
        setCookingSteps(parsedRecipe.steps);
      }
    }
  }, [form]);

  // 添加组件卸载时的清理
  useEffect(() => {
    return () => {
      localStorage.removeItem('editRecipe');
    };
  }, []);

  const addStep = () => {
    setCookingSteps([...cookingSteps, '']);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...cookingSteps];
    newSteps[index] = value;
    setCookingSteps(newSteps);
  };

  const deleteStep = (index: number) => {
    const newSteps = cookingSteps.filter((_, i) => i !== index);
    setCookingSteps(newSteps);
  };

  const addIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients(prev => [...prev, {
        name: newIngredient.name.trim(),
        amount: newIngredient.amount.trim() || '适量'
      }]);
      setNewIngredient({ name: '', amount: '' });
    } else {
      Toast.show({
        content: '请输入食材名称',
        position: 'center',
      });
    }
  };

  const deleteIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const onFinish = async (values: RecipeForm) => {
    console.log(values, "values  finish click");
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
        ingredients: ingredients.map(item => `${item.name},${item.amount}`),
        cooking_time: Math.max(1, Number(values.cookTime)),
        steps: cookingSteps.filter(step => step.trim().length > 0),
        cover_image: values.cover[0],
        stepType: values.stepType === 'video' ? 'VIDEO' : 'IMAGES',
        stepVideo: values.stepVideo || [],
        stepImages: values.stepImages || [],
      };

      console.log(postData, "postData");

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
        style={{ backgroundColor: '#ff6b6b', color: '#fff', width: '100%' }}
      >
        编辑菜谱
      </NavBar>
      <Flex direction="column" className="p-4 overflow-auto flex-1">
        <Form
          form={form}
          style={{
            '--prefix-width': '80px',
          }}
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
              className="w-full"
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
                    <Radio className="mr-3" key={key} value={key}>{value}</Radio>
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

            <Form.Item
              name='stepType'
              label='教程方式'
              required
              initialValue="video"
              className="mb-4 [--adm-prefix-label-width:4em] w-full"
            >
              <Radio.Group>
                <Space className="!flex-row">
                  <Radio value='video'>
                    <Space align="center">
                      <span className="text-base">视频教学</span>
                    </Space>
                  </Radio>
                  <Radio value='image'>
                    <Space align="center">
                      <span className="text-base">图文教学</span>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.stepType !== currentValues.stepType}
            >
              {({ getFieldValue }) => {
                const currentStepType = getFieldValue('stepType');
                return (
                  <Form.Item
                    style={{
                      '--prefix-width': '80px',
                      width: '100%',
                    }}
                    name={currentStepType === 'video' ? 'stepVideo' : 'stepImgs'}
                    label={currentStepType === 'video' ? '上传视频' : '上传图片'}
                  >
                    <ImageUploader
                      type={currentStepType === 'video' ? 'video' : 'img'}
                      count={currentStepType === 'video' ? 1 : 6}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Flex>

          {/* 食材清单 */}
          <Flex direction="column" className="bg-white p-4 mb-3 drop-shadow-xl rounded-md">
            <h3 className="text-lg font-bold mb-4">食材清单</h3>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 rounded-md px-2  border border-gray-100 group relative"
                >
                  <span className="font-medium text-gray-700">{ingredient.name}</span>
                  <span className="ml-2 text-gray-500">{ingredient.amount}</span>
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b6b] rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-red-500 hover:shadow-md transition-all duration-200"
                    onClick={() => deleteIngredient(index)}
                  >
                    <CloseOutline className="text-white text-xs" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 w-full">
              <div className="text-sm text-gray-500 mb-2">添加新食材</div>
              <Flex className="gap-2" justify="space-between">
                <input
                  type="text"
                  className="w-[140px] px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-[#ff6b6b]"
                  placeholder="食材名称"
                  value={newIngredient.name}
                  onChange={e => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addIngredient()}
                />
                <input
                  type="number"
                  className="w-[80px] px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-[#ff6b6b]"
                  placeholder="数量"
                  value={newIngredient.amount}
                  onChange={e => setNewIngredient(prev => ({ ...prev, amount: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addIngredient()}
                />
                <Button
                  color="primary"
                  className="!px-3 !min-w-[64px]"
                  onClick={addIngredient}
                  style={{
                    backgroundColor: '#ff6b6b',
                  }}
                >
                  添加
                </Button>
              </Flex>
            </div>
          </Flex>

          {/* 烹饪步骤 */}
          <Flex direction="column" className="bg-white p-4 drop-shadow-xl rounded-md">
            <h3 className="text-lg font-bold mb-4">烹饪步骤</h3>
            <div className="space-y-4 w-full">
              {cookingSteps.map((step, index) => (
                <Flex
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md relative w-full"
                >
                  <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#ff6b6b] text-white rounded-full font-medium">
                    {index + 1}
                  </div>
                  <TextArea
                    value={step}
                    onChange={(value: string) => updateStep(index, value)}
                    placeholder="请输入步骤内容"
                    className="flex-1 !bg-transparent !min-h-[24px]"
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    style={{
                      '--font-size': '14px',
                    }}
                  />
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff6b6b] rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-red-500 hover:shadow-md transition-all duration-200"
                    onClick={() => deleteStep(index)}
                  >
                    <CloseOutline className="text-white text-sm" />
                  </div>
                </Flex>
              ))}
            </div>
            <Flex
              onClick={addStep}
              className="mt-6 text-[#ff6b6b] w-full"
              style={{
                height: '48px',
                border: '1px dashed #ff6b6b',
                borderRadius: '8px',
              }}
              alignItems="center"
              justify="center"
            >
              <AddOutline className="mr-1" /> 添加步骤
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
} 