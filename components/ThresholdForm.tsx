// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// interface PriceAlertFormProps {
//   blockchain: {
//     id: string;
//     name: string;
//     symbol: string;
//     current_price: number;
//     image?: string; // Added image property
//   };
//   onSubmit: (data: PriceAlertData) => void;
//   onClose: () => void;
// }

// interface PriceAlertData {
//   blockchainId: string;
//   name: string;
//   symbol: string;
//   targetPrice: number;
//   alertMode: 'once' | 'recurring';
// }

// export function ThresholdForm({ blockchain, onSubmit, onClose }: PriceAlertFormProps) {
//   const [targetPrice, setTargetPrice] = useState(blockchain.current_price);
//   const [alertMode, setAlertMode] = useState<'once' | 'recurring'>('once');
//   const [error, setError] = useState<string | null>(null);
//   const [isValid, setIsValid] = useState(true);

//   // Preset percentage options
//   const percentageOptions = [
//     { label: '-20%', value: -20 },
//     { label: '-10%', value: -10 },
//     { label: '-5%', value: -5 },
//     { label: '+5%', value: 5 },
//     { label: '+10%', value: 10 },
//     { label: '+20%', value: 20 },
//   ];

//   useEffect(() => {
//     validateTargetPrice(targetPrice);
//   }, [targetPrice]);

//   const validateTargetPrice = (price: number) => {
//     if (isNaN(price)) {
//       setError("Please enter a valid number");
//       setIsValid(false);
//       return;
//     }
//     if (price === blockchain.current_price) {
//       setError("Target price must be different from the current price");
//       setIsValid(false);
//       return;
//     }
//     setError(null);
//     setIsValid(true);
//   };

//   const handlePercentageClick = (percentage: number) => {
//     const newPrice = blockchain.current_price * (1 + percentage / 100);
//     setTargetPrice(Number(newPrice.toFixed(2)));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isValid) {
//       const data = {
//         blockchainId: blockchain.id,
//         name: blockchain.name,
//         symbol: blockchain.symbol,
//         targetPrice: Number(targetPrice.toFixed(2)),
//         alertMode,
//       };
      
//       onSubmit(data);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//     >
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
//         <div className="flex items-center mb-4">
//           <button 
//             onClick={onClose}
//             className="p-2 mr-4"
//           >
//             ←
//           </button>
//           <h2 className="text-xl font-bold">Add Price Alert</h2>
//         </div>
        
//         <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-between">
//           <div className="flex items-center">
//             {blockchain.image ? (
//               <img 
//                 src={blockchain.image} 
//                 alt={blockchain.symbol} 
//                 className="w-8 h-8 rounded-full mr-3" 
//               />
//             ) : (
//               <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-white">
//                 {blockchain.symbol.charAt(0)}
//               </div>
//             )}
//             <div>
//               <p className="font-medium">{blockchain.symbol}</p>
//               <p className="text-sm text-gray-500">{blockchain.name}</p>
//             </div>
//           </div>
//           <p className="font-bold">${blockchain.current_price.toLocaleString()}</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <Label htmlFor="targetPrice" className="text-base font-medium mb-2 block">Target Price</Label>
//             <div className="flex flex-wrap gap-2 mb-3">
//               {percentageOptions.map((option) => (
//                 <button
//                   key={option.label}
//                   type="button"
//                   onClick={() => handlePercentageClick(option.value)}
//                   className={`px-3 py-2 rounded-full text-sm ${
//                     option.value < 0 
//                       ? 'bg-red-100 text-red-700 hover:bg-red-200' 
//                       : 'bg-green-100 text-green-700 hover:bg-green-200'
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//             <div className="relative">
//               <Input
//                 id="targetPrice"
//                 type="number"
//                 value={targetPrice}
//                 onChange={(e) => setTargetPrice(Number(e.target.value))}
//                 step="0.01"
//                 required
//                 className={targetPrice === blockchain.current_price ? "border-red-500 pr-16" : "pr-16"}
//               />
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 USD
//               </div>
//             </div>
//           </div>

//           <div>
//             <Label className="text-base font-medium mb-2 block">Alert Mode</Label>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setAlertMode('once')}
//                 className={`py-2 px-4 rounded-full text-center ${
//                   alertMode === 'once'
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                 }`}
//               >
//                 Once
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setAlertMode('recurring')}
//                 className={`py-2 px-4 rounded-full text-center ${
//                   alertMode === 'recurring'
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                 }`}
//               >
//                 Recurring
//               </button>
//             </div>
//           </div>

//           <div className="mt-4">
//             <p className="text-sm text-gray-500 mb-4">
//               You will receive a {alertMode === 'once' ? 'one-time' : 'recurring'} notification when the 
//               price of 1 {blockchain.symbol} {targetPrice > blockchain.current_price ? 'reaches' : 'drops to'} ${targetPrice.toFixed(2)}
//             </p>
            
//             <Button 
//               type="submit" 
//               disabled={!isValid}
//               className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded"
//             >
//               Save
//             </Button>
//           </div>
//         </form>
//       </div>
//     </motion.div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, AlertCircle, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceAlertFormProps {
  blockchain: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image?: string;
  };
  onSubmit: (data: PriceAlertData) => void;
  onClose: () => void;
  isEditing?: boolean;
}

interface PriceAlertData {
  blockchainId: string;
  name: string;
  symbol: string;
  targetPrice: number;
  alertMode: 'once' | 'recurring';
  logo?: string;
}

export function ThresholdForm({ blockchain, onSubmit, onClose, isEditing = false }: PriceAlertFormProps) {
  const [targetPrice, setTargetPrice] = useState(blockchain.current_price);
  const [alertMode, setAlertMode] = useState<'once' | 'recurring'>('once');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Preset percentage options
  const percentageOptions = [
    { label: '-20%', value: -20 },
    { label: '-10%', value: -10 },
    { label: '-5%', value: -5 },
    { label: '+5%', value: 5 },
    { label: '+10%', value: 10 },
    { label: '+20%', value: 20 },
  ];

  useEffect(() => {
    validateTargetPrice(targetPrice);
  }, [targetPrice]);

  const validateTargetPrice = (price: number) => {
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid positive number");
      setIsValid(false);
      return;
    }
    
    if (price === blockchain.current_price) {
      setError("Target price must be different from the current price");
      setIsValid(false);
      return;
    }
    
    setError(null);
    setIsValid(true);
  };

  const handlePercentageClick = (percentage: number) => {
    const newPrice = blockchain.current_price * (1 + percentage / 100);
    setTargetPrice(Number(newPrice.toFixed(2)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const data = {
        blockchainId: blockchain.id,
        name: blockchain.name,
        symbol: blockchain.symbol,
        targetPrice: Number(targetPrice.toFixed(2)),
        alertMode,
        logo: blockchain.image
      };
      
      onSubmit(data);
    }
  };

  // Calculate percentage difference from current price
  const priceDifference = targetPrice - blockchain.current_price;
  const percentageDiff = (priceDifference / blockchain.current_price) * 100;
  const isPriceIncreasing = targetPrice > blockchain.current_price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-2xl max-w-md w-full shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Update Price Alert' : 'Add Price Alert'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-between border border-gray-700">
          <div className="flex items-center">
            {blockchain.image ? (
              <div className="w-12 h-12 rounded-full bg-black p-1 mr-4 flex items-center justify-center">
                <img 
                  src={blockchain.image} 
                  alt={blockchain.symbol} 
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                {blockchain.symbol.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg text-white">{blockchain.symbol.toUpperCase()}</p>
              <p className="text-sm text-gray-400">{blockchain.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-lg font-bold text-white">${blockchain.current_price.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Current Price</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="targetPrice" className="text-base font-medium mb-3 block text-white">Target Price</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {percentageOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handlePercentageClick(option.value)}
                  className={`px-3 py-2 rounded-full text-sm border transition-all ${
                    option.value < 0 
                      ? 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                      : 'border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Input
                id="targetPrice"
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                step="0.01"
                min="0"
                required
                className={`
                  bg-gray-800/50 border-gray-700 text-white pr-16 h-14 text-lg
                  ${targetPrice === blockchain.current_price ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500" : ""}
                `}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                USD
              </div>
            </div>
            
            {isValid && (
              <div className="mt-3 flex items-center gap-2">
                {isPriceIncreasing ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${isPriceIncreasing ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(percentageDiff).toFixed(2)}% {isPriceIncreasing ? 'higher' : 'lower'} than current price
                </span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block text-white">Alert Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAlertMode('once')}
                className={`py-3 px-4 rounded-xl text-center transition-all ${
                  alertMode === 'once'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg shadow-purple-900/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                }`}
              >
                One Time
              </button>
              <button
                type="button"
                onClick={() => setAlertMode('recurring')}
                className={`py-3 px-4 rounded-xl text-center transition-all ${
                  alertMode === 'recurring'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg shadow-purple-900/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                }`}
              >
                Recurring
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {alertMode === 'once' ? 
                'You will be notified once when the price threshold is reached.' : 
                'You will be notified every time the price crosses your threshold.'
              }
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-400 mb-5">
              You will receive a {alertMode === 'once' ? 'one-time' : 'recurring'} notification when the 
              price of 1 {blockchain.symbol.toUpperCase()} {targetPrice > blockchain.current_price ? 'rises to' : 'drops to'} ${targetPrice.toFixed(2)}
            </p>
            
            <Button 
              type="submit" 
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update Alert' : 'Save Alert'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}