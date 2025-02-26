"use client";

import { NavBar, Input, Button, TextArea, Form, Radio, Toast } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form";
import Flex from "@/components/Flex";
import ImageUploader from '@/components/ImageUploader';
import { Recipe, RecipeType, typeMap } from '@/types/recipe';
import { useState } from "react";

interface RecipeFormProps {
  mode: 'view' | 'edit';
  initialData?: Recipe;
  onSubmit?: (values: RecipeFormValues) => void;
  form?: FormInstance<RecipeFormValues>;
}

export interface RecipeFormValues {
  name: string;
  cover: string;
  type: RecipeType;
  cookTime: number;
  ingredients: string;
  steps: string;
}

export default function RecipeForm({ mode, initialData, onSubmit, form: externalForm }: RecipeFormProps) {
  const [form] = Form.useForm(externalForm as FormInstance);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RecipeFormValues) => {
    if (mode === 'view' || !onSubmit) return;
    
    setLoading(true);
    Toast.show({
      icon: 'loading',
      content: '保存中...',
      duration: 0,
    });

    try {
      await onSubmit(values);
      Toast.show({
        icon: 'success',
        content: '保存成功',
      });
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
      <NavBar
        onBack={() => window.history.back()}
        style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
      >
        {mode === 'edit' ? '编辑菜谱' : '菜谱详情'}
      </NavBar>
      <Flex direction="column" className="p-4 overflow-auto flex-1">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout='horizontal'
          initialValues={{ 
            type: 'MIXED',
            ...initialData,
            ingredients: initialData?.ingredients?.join('\n'),
            steps: initialData?.steps?.join('\n'),
          }}
          disabled={mode === 'view'}
          footer={
            mode === 'edit' ? (
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
            ) : null
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