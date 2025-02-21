'use client';

import { useParams, useRouter } from 'next/navigation';

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-600"
      >
        返回
      </button>

      <h1 className="text-2xl font-bold mb-6">详情页 {id}</h1>
      
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">详细内容</h2>
        <p className="text-gray-600">
          这是菜单项 {id} 的详细内容...
        </p>
      </div>
    </div>
  );
} 