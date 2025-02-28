"use client";

import { TurntableData } from "@/app/turntable/page";
import { Button } from "antd-mobile";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import Flex from "@/components/Flex";
// 动态导入 IconCloud 组件
const IconCloud = dynamic(
  () => import('../../components/magicui/icon-cloud').then(mod => mod.IconCloud),
  { ssr: false }
);

interface Prize {
    fonts: Array<{ text: string }>;
}

export default function ImagesCloud({ data, onEnd, onStart }: { 
    data: TurntableData[], 
    onEnd: (prize: Prize) => void, 
    onStart: () => void 
}) {
    const [yRotationSpeed, setYRotationSpeed] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const selectedIndexRef = useRef(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        if (!isMounted) return;
        if (isSpinning) {
            // 随机选择一个索引
            selectedIndexRef.current = Math.floor(Math.random() * data.length);
            
            // 加速阶段
            const accelerateInterval = setInterval(() => {
                setYRotationSpeed(prev => {
                    if (prev >= 0.2) {
                        clearInterval(accelerateInterval);
                        // 开始减速
                        const decelerateInterval = setInterval(() => {
                            setYRotationSpeed(prev => {
                                if (prev <= 0) {
                                    clearInterval(decelerateInterval);
                                    setIsSpinning(false);
                                    // 提供与LuckyTurnTable相同格式的结果
                                    onEnd({ fonts: [{ text: data[selectedIndexRef.current].name }] });
                                    return 0;
                                }
                                return prev - 0.005;
                            });
                        }, 100);
                        return 0.2;
                    }
                    return prev + 0.01;
                });
            }, 50);
        }
    }, [isSpinning, onEnd, isMounted, data]);

    const handleStart = () => {
        setIsSpinning(true);
        onStart();
    }

    if (!isMounted) {
        return <div className="w-full h-full" />;
    }

    return (
        <div className="w-full h-full ">
            <IconCloud images={data.map(item => item.img)} yRotationSpeed={yRotationSpeed} />
            <Button onClick={handleStart} disabled={isSpinning}>开始</Button>
        </div>
    );
}

