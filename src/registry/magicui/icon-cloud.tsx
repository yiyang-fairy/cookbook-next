"use client";

import { useEffect, useRef } from "react";

interface IconCloudProps {
  images: string[];
}

export const IconCloud = ({ images }: IconCloudProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 基本画布设置
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 这里可以添加动画逻辑
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}; 