'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MenuItem {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
}

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchMenuItem() {
      try {
        const response = await fetch(`/api/menu/${id}`);
        const data = await response.json();
        if (mounted) {
          setItem(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('获取详情失败:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchMenuItem();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen p-4">加载中...</div>;
  }

  if (!item) {
    return <div className="min-h-screen p-4">未找到该菜单项</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-600"
      >
        返回
      </button>

      <h1 className="text-2xl font-bold mb-6">{item.title}</h1>
      
      <div className="p-4 border rounded-lg">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-lg font-semibold mb-2">{item.description}</h2>
        <p className="text-gray-600">{item.content}</p>
      </div>
    </div>
  );
} 