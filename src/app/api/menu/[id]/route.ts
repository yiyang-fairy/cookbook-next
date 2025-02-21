import { NextResponse } from 'next/server';

const menuData = [
  { 
    id: 1, 
    title: '菜单项1', 
    description: '描述1',
    content: '这是菜单项1的详细内容...',
    imageUrl: 'https://example.com/image1.jpg'
  },
  { 
    id: 2, 
    title: '菜单项2', 
    description: '描述2',
    content: '这是菜单项2的详细内容...',
    imageUrl: 'https://example.com/image2.jpg'
  },
  { 
    id: 3, 
    title: '菜单项3', 
    description: '描述3',
    content: '这是菜单项3的详细内容...',
    imageUrl: 'https://example.com/image3.jpg'
  },
];

// GET 获取单个菜单项
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const item = menuData.find(item => item.id === id);
  
  if (!item) {
    return NextResponse.json(
      { error: '未找到该菜单项' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(item);
} 