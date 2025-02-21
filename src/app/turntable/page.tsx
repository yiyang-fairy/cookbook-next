'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TurntablePage() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    // 模拟转盘旋转
    setTimeout(() => {
      setIsSpinning(false);
      alert('恭喜获得奖品！');
    }, 3000);
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
          className={`w-64 h-64 border-8 border-yellow-500 rounded-full mb-6 flex items-center justify-center ${
            isSpinning ? 'animate-spin' : ''
          }`}
        >
          <span className="text-lg font-bold">转盘区域</span>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`px-8 py-3 rounded-full text-white ${
            isSpinning 
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