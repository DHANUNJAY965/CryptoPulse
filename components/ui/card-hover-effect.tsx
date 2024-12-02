"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ActivitySquareIcon } from "lucide-react";

// Define the type for the blockchain item
interface BlockchainItem {
  name: string;
  thresholdMin: number;
  thresholdMax: number;
  id?: string;
  userId?: string;
  currentValue?: number;
}

// Define props type for the component
interface CryptoHoverEffectProps {
  items: BlockchainItem[];
  className?: string;
}

const CryptoHoverEffect: React.FC<CryptoHoverEffectProps> = ({ 
  items, 
  className 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => {
        return (
          <div
            key={item.name}
            className="relative group block"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <div className="rounded-2xl h-full w-full p-6 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
              <div className="relative z-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-zinc-100 text-lg font-bold">
                    {item.name}
                  </h4>
                  <div className="flex gap-2 items-center">
                    <ActivitySquareIcon className="text-zinc-400 hover:text-zinc-100 cursor-pointer w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Min Threshold</span>
                    {!edit && (
                      <span className="text-zinc-300 font-mono">
                        ${item.thresholdMin.toFixed(2)}
                      </span>
                    )}         
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Max Threshold</span>
                    {!edit && (
                      <span className="text-zinc-300 font-mono">
                        ${item.thresholdMax.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoHoverEffect;