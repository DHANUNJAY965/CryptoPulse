import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ThresholdFormProps {
  blockchain: {
    id: string;
    name: string;
    symbol: string;  // Added symbol to props
    current_price: number;
  };
  onSubmit: (data: ThresholdData) => void;
  onClose: () => void;
}

interface ThresholdData {
  blockchainId: string;
  name: string;
  symbol: string;
  lowThreshold: number;
  highThreshold: number;
  notifications: boolean;
}

export function ThresholdForm({ blockchain, onSubmit, onClose }: ThresholdFormProps) {
  const [lowThreshold, setLowThreshold] = useState(Number((blockchain.current_price * 0.9).toFixed(8)));
  const [highThreshold, setHighThreshold] = useState(Number((blockchain.current_price * 1.1).toFixed(8)));
  const [notifications, setNotifications] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateThresholds(lowThreshold, highThreshold);
  }, [lowThreshold, highThreshold]);

  const validateThresholds = (low: number, high: number) => {
    if (isNaN(low) || isNaN(high)) {
      setError("Please enter valid numbers");
      setIsValid(false);
      return;
    }
    if (low >= blockchain.current_price) {
      setError("Low threshold must be less than the current price");
      setIsValid(false);
      return;
    }
    if (high <= blockchain.current_price) {
      setError("High threshold must be greater than the current price");
      setIsValid(false);
      return;
    }
    if (low >= high) {
      setError("Low threshold must be less than high threshold");
      setIsValid(false);
      return;
    }
    setError(null);
    setIsValid(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const data = {
        blockchainId: blockchain.id,
        name: blockchain.name,
        symbol: blockchain.symbol,
        lowThreshold: Number(lowThreshold.toFixed(2)),
        highThreshold: Number(highThreshold.toFixed(3)),
        notifications,
      };
      
      // Log the data being sent
      // console.log('Submitting data:', data);
      
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
        <h2 className="text-2xl font-bold mb-4">Set Thresholds for {blockchain.name}</h2>
        
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm font-medium">Current Price</p>
          <p className="text-lg font-bold">${blockchain.current_price.toFixed(8)}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lowThreshold">Low Threshold ($)</Label>
            <Input
              id="lowThreshold"
              type="number"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(Number(e.target.value))}
              step="0.00000001"
              required
              className={lowThreshold >= blockchain.current_price ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500 mt-1">Current price: ${blockchain.current_price.toFixed(8)}</p>
          </div>

          <div>
            <Label htmlFor="highThreshold">High Threshold ($)</Label>
            <Input
              id="highThreshold"
              type="number"
              value={highThreshold}
              onChange={(e) => setHighThreshold(Number(e.target.value))}
              step="0.00000001"
              required
              className={highThreshold <= blockchain.current_price ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500 mt-1">Current price: ${blockchain.current_price.toFixed(8)}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Label htmlFor="notifications">Receive notifications</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid}
            >
              Set Price Alerts
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}