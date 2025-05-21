// import React, { useState } from "react";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion";
// import { EditIcon } from "lucide-react";
// import Image from "next/image";

// interface BlockchainItem {
//   name: string;
//   targetPrice: number;
//   alertMode: string;
//   id?: string;
//   userId?: string;
//   currentValue?: number;
//   logo?: string;
//   symbol?: string;
// }

// interface CryptoHoverEffectProps {
//   items: BlockchainItem[];
//   className?: string;
// }

// const CryptoHoverEffect: React.FC<CryptoHoverEffectProps> = ({ items, className }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
//   const [edit, setEdit] = useState<boolean>(false);

//   return (
//     <div className="w-full overflow-hidden px-4 sm:px-6">
//       <div className={cn(
//         "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full",
//         className
//       )}>
//         {items.map((item, idx) => (
//           <div
//             key={item.name}
//             className="relative group w-full min-h-[180px] flex-shrink-0"
//             onMouseEnter={() => setHoveredIndex(idx)}
//             onMouseLeave={() => setHoveredIndex(null)}
//           >
//             <AnimatePresence>
//               {hoveredIndex === idx && (
//                 <motion.span
//                   className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
//                   layoutId="hoverBackground"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1, transition: { duration: 0.15 } }}
//                   exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
//                 />
//               )}
//             </AnimatePresence>
//             <div className="rounded-2xl h-full w-full p-4 sm:p-6 bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
//               <div className="relative z-50 space-y-4">
//                 <div className="flex items-center justify-between gap-2">
//                   <h4 className="text-zinc-100 items-center gap-2 text-base sm:text-lg flex font-bold truncate">
//                     <div className="min-w-8 shrink-0">
//                       <Image
//                         src={item.logo || ""}
//                         alt={item.name}
//                         width={32}
//                         height={32}
//                         className="rounded-full"
//                       />
//                     </div>
//                     <span className="truncate">{item.name}</span>
//                     {item.symbol && <span className="text-zinc-400 text-xs">({item.symbol?.toUpperCase()})</span>}
//                   </h4>
//                   <EditIcon className="w-5 h-5 shrink-0" />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-zinc-400 text-xs sm:text-sm">Target Price</span>
//                     {!edit && (
//                       <span className="text-zinc-300 font-mono text-sm">
//                         ${item.targetPrice.toFixed(2)}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-zinc-400 text-xs sm:text-sm">Alert Mode</span>
//                     {!edit && (
//                       <span className="text-zinc-300 font-mono text-sm capitalize">
//                         {item.alertMode}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CryptoHoverEffect;

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, TrendingUp, TrendingDown, Bell, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface BlockchainItem {
  name: string;
  targetPrice: number;
  alertMode: string;
  id?: string;
  userId?: string;
  currentValue?: number;
  logo?: string;
  symbol?: string;
}

interface CryptoHoverEffectProps {
  items: BlockchainItem[];
  className?: string;
  onEdit?: (item: BlockchainItem) => void;
}

const CryptoHoverEffect: React.FC<CryptoHoverEffectProps> = ({ 
  items, 
  className,
  onEdit 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getStatusColor = (item: BlockchainItem) => {
    if (!item.currentValue) return "border-gray-600";
    
    const diff = item.targetPrice - item.currentValue;
    const percentage = Math.abs(diff / item.currentValue * 100);
    
    // Close to target (within 5%)
    if (percentage <= 5) return "border-yellow-500";
    
    // Above or below target
    if (item.targetPrice > item.currentValue) {
      return "border-green-500"; // Need to go up to reach target
    } else {
      return "border-red-500"; // Need to go down to reach target
    }
  };

  const getPriceDirection = (item: BlockchainItem) => {
    if (!item.currentValue) return { color: "text-gray-400", icon: AlertTriangle, text: "No data" };
    
    if (item.targetPrice > item.currentValue) {
      return { 
        color: "text-green-500", 
        icon: TrendingUp, 
        text: `${((item.targetPrice/item.currentValue - 1) * 100).toFixed(2)}% to target` 
      };
    } else {
      return { 
        color: "text-red-500", 
        icon: TrendingDown, 
        text: `${((1 - item.targetPrice/item.currentValue) * 100).toFixed(2)}% to target` 
      };
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full",
          className
        )}
      >
        {items.map((item, idx) => {
          const statusColor = getStatusColor(item);
          const priceDirection = getPriceDirection(item);
          const PriceIcon = priceDirection.icon;
          
          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 block rounded-2xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                  />
                )}
              </AnimatePresence>
              
              <div className={cn(
                "rounded-2xl h-full w-full p-6 bg-black/70 backdrop-blur-sm border-2 relative z-20 overflow-hidden transition-all duration-300",
                statusColor,
                hoveredIndex === idx ? "shadow-lg shadow-purple-500/20" : ""
              )}>
                {/* Background glow effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/5 rounded-full blur-xl" />
                
                {/* Alert mode indicator */}
                <div className={cn(
                  "absolute top-3 right-3 rounded-full flex items-center justify-center",
                  item.alertMode === "recurring" ? "text-purple-400" : "text-gray-400"
                )}>
                  <Bell className="w-4 h-4" />
                </div>
                
                <div className="relative z-50 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 p-0.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                        {item.logo ? (
                          <Image
                            src={item.logo}
                            alt={item.name}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-sm font-bold">
                            {item.symbol?.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs uppercase">{item.symbol}</span>
                        {item.alertMode === "recurring" && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-sm">Recurring</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-1">
                    {/* Current Price */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Current Price</span>
                      <span className="text-white font-mono font-medium">
                        ${item.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}
                      </span>
                    </div>
                    
                    {/* Target Price */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Target Price</span>
                      <span className="text-white font-mono font-medium">
                        ${item.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {/* Price Direction */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                      <div className={cn("flex items-center gap-1", priceDirection.color)}>
                        <PriceIcon className="w-4 h-4" />
                        <span className="text-xs">{priceDirection.text}</span>
                      </div>
                      
                      <button 
                        onClick={() => onEdit && onEdit(item)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group-hover:bg-purple-600/30"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CryptoHoverEffect;