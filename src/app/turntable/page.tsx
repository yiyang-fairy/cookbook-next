'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';


// 添加示例图标数据
const icons = [
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z" />
  </svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
  </svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
];

// 动态导入 IconCloud 组件
const IconCloud = dynamic(
  () => import('../../components/magicui/icon-cloud').then(mod => mod.IconCloud),
  { ssr: false }
);
interface Prize {
  id: number;
  name: string;
}

export default function TurntablePage() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    setIsSpinning(true);

    try {
      const response = await fetch('/api/turntable', {
        method: 'POST',
      });
      const data = await response.json();

      // 等待动画结束后显示结果
      setTimeout(() => {
        setIsSpinning(false);
        alert(`恭喜获得：${data.prize.name}！`);
      }, 3000);
    } catch (error) {
      console.error('抽奖失败:', error);
      setIsSpinning(false);
      alert('抽奖失败，请重试');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-600"
      >
        返回
      </button>

      <h1 className="text-2xl font-bold mb-6">幸运转盘</h1>

      <div className="flex flex-col items-center">
        <div
          className={`w-64 h-64 border-8 border-yellow-500 rounded-full mb-6 flex items-center justify-center ${isSpinning ? 'animate-spin' : ''
            }`}
        >
          <span className="text-lg font-bold">转盘区域</span>
        </div>

        {/* IconCloud 组件 */}
        <div className="min-h-[400px] flex items-center justify-center">
          {typeof window !== 'undefined' && <IconCloud icons={icons} />}
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`px-8 py-3 rounded-full text-white ${isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
        >
          {isSpinning ? '旋转中...' : '开始抽奖'}
        </button>
      </div>
    </div>
  );
} 