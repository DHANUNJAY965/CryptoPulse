import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PriceAlertFormProps {
  blockchain: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image?: string; // Added image property
  };
  onSubmit: (data: PriceAlertData) => void;
  onClose: () => void;
}

interface PriceAlertData {
  blockchainId: string;
  name: string;
  symbol: string;
  targetPrice: number;
  alertMode: 'once' | 'recurring';
}

export function ThresholdForm({ blockchain, onSubmit, onClose }: PriceAlertFormProps) {
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
    if (isNaN(price)) {
      setError("Please enter a valid number");
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
      };
      
      onSubmit(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex items-center mb-4">
          <button 
            onClick={onClose}
            className="p-2 mr-4"
          >
            ←
          </button>
          <h2 className="text-xl font-bold">Add Price Alert</h2>
        </div>
        
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-between">
          <div className="flex items-center">
            {blockchain.image ? (
              <img 
                src={blockchain.image} 
                alt={blockchain.symbol} 
                className="w-8 h-8 rounded-full mr-3" 
              />
            ) : (
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-white">
                {blockchain.symbol.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{blockchain.symbol}</p>
              <p className="text-sm text-gray-500">{blockchain.name}</p>
            </div>
          </div>
          <p className="font-bold">${blockchain.current_price.toLocaleString()}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="targetPrice" className="text-base font-medium mb-2 block">Target Price</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {percentageOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handlePercentageClick(option.value)}
                  className={`px-3 py-2 rounded-full text-sm ${
                    option.value < 0 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
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
                required
                className={targetPrice === blockchain.current_price ? "border-red-500 pr-16" : "pr-16"}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                USD
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Alert Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAlertMode('once')}
                className={`py-2 px-4 rounded-full text-center ${
                  alertMode === 'once'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Once
              </button>
              <button
                type="button"
                onClick={() => setAlertMode('recurring')}
                className={`py-2 px-4 rounded-full text-center ${
                  alertMode === 'recurring'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Recurring
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              You will receive a {alertMode === 'once' ? 'one-time' : 'recurring'} notification when the 
              price of 1 {blockchain.symbol} {targetPrice > blockchain.current_price ? 'reaches' : 'drops to'} ${targetPrice.toFixed(2)}
            </p>
            
            <Button 
              type="submit" 
              disabled={!isValid}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}