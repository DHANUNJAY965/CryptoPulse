"use client";
import { BackgroundLines } from "@/components/ui/background-lines";
import { AuthDialog } from "@/components/auth-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from 'framer-motion';
import { ArrowRight, LineChart, Bell, Shield } from 'lucide-react';
export default function Home() {
  
  return (
    <BackgroundLines>
      <ThemeToggle />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
          CryptoPulse
        </h1>
        <p className="mt-4 font-normal text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-lg">
          Smarter Alerts for Smarter Investors. Track, Notify, and Analyze Blockchain Prices
        </p>
        <AuthDialog />
        <div className="flex">
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="p-6 rounded-lg bg-card">
            <LineChart className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor cryptocurrency prices in real-time with accurate data and beautiful visualizations.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card">
            <Bell className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
            <p className="text-muted-foreground">
              Set custom price thresholds and receive instant email notifications when they're triggered.
            </p>
          </div>
          </motion.div>
        </div>
        
      </div>
      
    </BackgroundLines>
  );
}