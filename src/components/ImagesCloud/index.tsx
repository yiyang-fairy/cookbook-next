"use client";

import { TurntableData } from "@/app/turntable/page";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import Flex from "@/components/Flex";
import { NeonGradientCard } from "../magicui/neon-gradient-card";
// 动态导入 IconCloud 组件
const IconCloud = dynamic(
  () => import('../../components/magicui/icon-cloud').then(mod => mod.IconCloud),
  { ssr: false }
);

export default function ImagesCloud({ data, onEnd, onStart }: { 
    data: TurntableData[], 
    onEnd: (prize: TurntableData) => void, 
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
                                    // 使用 setTimeout 延迟调用 onEnd
                                    setTimeout(() => {
                                        onEnd(data[selectedIndexRef.current]);
                                    }, 0);
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
        if (isSpinning) return;
        setIsSpinning(true);
        onStart();
    }

    if (!isMounted) {
        return <div className="w-full h-full" />;
    }

    return (
        <Flex direction="column" alignItems="center" justify="center" className="w-full h-full ">
            <IconCloud images={data.map(item => item.img)} yRotationSpeed={yRotationSpeed} />
            <NeonGradientCard onClick={handleStart} className={`w-16 h-8 flex items-center justify-center p-0 ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 transition-transform'}`}>
                <span className="pointer-events-none z-10 bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-sm text-nowrap font-medium text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                    开始
                </span>
            </NeonGradientCard>
        </Flex>
    );
}

