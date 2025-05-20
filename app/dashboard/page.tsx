"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/ui/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";
import CryptoHoverEffect from "@/components/ui/card-hover-effect";

// Type definition for blockchain item from API
interface BlockchainItem {
  blockchainId: string;
  name: string;
  targetPrice: number;
  logo: string;
  alertMode: string;
  userId: string;
  symbol: string;
  currentValue?: number;
}

// Type definition for dashboard item (used in hover effect)
interface DashboardHoverItem {
  id: string;
  name: string;
  targetPrice: number;
  alertMode: string;
  logo: string;
  userId: string;
  symbol: string;
  currentValue: number;
}

function Dashboard() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [blockchains, setBlockchains] = useState<DashboardHoverItem[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlockchains = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.data) {
          const data: DashboardHoverItem[] = response.data.map((item: BlockchainItem) => {
            return {
              id: item.blockchainId,
              name: item.name,
              targetPrice: item.targetPrice,
              alertMode: item.alertMode || "once", // Default to "once" if not provided
              logo: item.logo,
              userId: item.userId,
              symbol: item.symbol || "",
            };
          });
          setBlockchains(data);
          console.log("Fetched blockchains:", data);
        }
      } catch (error) {
        console.error("Failed to fetch blockchains:", error);
        toast({
          title: "Error",
          description: "Failed to load blockchains",
          variant: "destructive",
        });
      }
    };

    fetchBlockchains();
  }, []);

  return (
    <BackgroundLines>
      <Navbar />
      <div className="container pt-[6rem] mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to dashboard {session?.user?.name}!
        </h1>
        <CryptoHoverEffect items={blockchains} />
      </div>
    </BackgroundLines>
  );
}

export default Dashboard;