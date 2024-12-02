import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { EditIcon } from "lucide-react";
import Image from "next/image";

interface BlockchainItem {
  name: string;
  thresholdMin: number;
  thresholdMax: number;
  id?: string;
  userId?: string;
  currentValue?: number;
  logo?: string;
}

interface CryptoHoverEffectProps {
  items: BlockchainItem[];
  className?: string;
}

const CryptoHoverEffect: React.FC<CryptoHoverEffectProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <div className="w-full overflow-hidden px-4 sm:px-6">
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full",
        className
      )}>
        {items.map((item, idx) => (
          <div
            key={item.name}
            className="relative group w-full min-h-[180px] flex-shrink-0"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
            </AnimatePresence>
            <div className="rounded-2xl h-full w-full p-4 sm:p-6 bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
              <div className="relative z-50 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-zinc-100 items-center gap-2 text-base sm:text-lg flex font-bold truncate">
                    <div className="min-w-8 shrink-0">
                      <Image
                        src={item.logo || ""}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <span className="truncate">{item.name}</span>
                  </h4>
                  <EditIcon className="w-5 h-5 shrink-0" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-xs sm:text-sm">Min Threshold</span>
                    {!edit && (
                      <span className="text-zinc-300 font-mono text-sm">
                        ${item.thresholdMin.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-xs sm:text-sm">Max Threshold</span>
                    {!edit && (
                      <span className="text-zinc-300 font-mono text-sm">
                        ${item.thresholdMax.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoHoverEffect;