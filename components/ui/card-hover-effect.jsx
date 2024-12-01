"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ActivitySquareIcon,
} from "lucide-react";

const CryptoHoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [edit, setEdit] = useState(false);
  console.log(items);

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

// "use client";
// import React, { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion";
// import { PencilIcon, CheckIcon, XIcon, Trash2Icon } from "lucide-react";
// import { Input } from "@/components/ui/input";

// const CryptoHoverEffect = ({ items: initialItems, className }) => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [items, setItems] = useState(initialItems);
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({});

//   const handleEditClick = (item) => {
//     setEditingId(item.name);
//     setEditValues({
//       thresholdMin: item.thresholdMin.toString(),
//       thresholdMax: item.thresholdMax.toString()
//     });
//   };

//   const handleSave = (itemName) => {
//     setItems(items.map(item => {
//       if (item.name === itemName) {
//         return {
//           ...item,
//           thresholdMin: parseFloat(editValues.thresholdMin),
//           thresholdMax: parseFloat(editValues.thresholdMax)
//         };
//       }
//       return item;
//     }));
//     setEditingId(null);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditValues({});
//   };

//   return (
//     <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
//       {items.map((item, idx) => {
//         const isEditing = editingId === item.name;

//         return (
//           <div
//             key={item.name}
//             className="relative group block"
//             onMouseEnter={() => setHoveredIndex(idx)}
//             onMouseLeave={() => setHoveredIndex(null)}
//           >
//             <AnimatePresence>
//               {hoveredIndex === idx && (
//                 <motion.span
//                   className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
//                   layoutId="hoverBackground"
//                   initial={{ opacity: 0 }}
//                   animate={{
//                     opacity: 1,
//                     transition: { duration: 0.15 },
//                   }}
//                   exit={{
//                     opacity: 0,
//                     transition: { duration: 0.15, delay: 0.2 },
//                   }}
//                 />
//               )}
//             </AnimatePresence>
//             <div className="rounded-2xl h-full w-full p-6 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
//               <div className="relative z-50 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-zinc-100 text-lg font-bold">{item.name}</h4>
//                   <div className="flex gap-2">
//                     {!isEditing ? (
//                       <>
//                         <PencilIcon
//                           className="text-zinc-400 hover:text-zinc-100 cursor-pointer w-5 h-5"
//                           onClick={() => handleEditClick(item)}
//                         />
//                         <Trash2Icon className="text-red-500 hover:text-red-400 cursor-pointer w-5 h-5" />
//                       </>
//                     ) : (
//                       <>
//                         <CheckIcon
//                           className="text-green-500 hover:text-green-400 cursor-pointer w-5 h-5"
//                           onClick={() => handleSave(item.name)}
//                         />
//                         <XIcon
//                           className="text-red-500 hover:text-red-400 cursor-pointer w-5 h-5"
//                           onClick={handleCancel}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-zinc-400 text-sm">Min Threshold</span>
//                     {isEditing ? (
//                       <Input
//                         type="number"
//                         value={editValues.thresholdMin}
//                         onChange={(e) => setEditValues(prev => ({
//                           ...prev,
//                           thresholdMin: e.target.value
//                         }))}
//                         className="w-24 h-8 text-right"
//                       />
//                     ) : (
//                       <span className="text-zinc-300 font-mono">
//                         ${item.thresholdMin.toFixed(2)}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-zinc-400 text-sm">Max Threshold</span>
//                     {isEditing ? (
//                       <Input
//                         type="number"
//                         value={editValues.thresholdMax}
//                         onChange={(e) => setEditValues(prev => ({
//                           ...prev,
//                           thresholdMax: e.target.value
//                         }))}
//                         className="w-24 h-8 text-right"
//                       />
//                     ) : (
//                       <span className="text-zinc-300 font-mono">
//                         ${item.thresholdMax.toFixed(2)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CryptoHoverEffect;
