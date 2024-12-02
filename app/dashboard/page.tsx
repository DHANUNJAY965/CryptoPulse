"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/ui/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";
import CryptoHoverEffect from "@/components/ui/card-hover-effect";

// Type definition for blockchain item
interface BlockchainItem {
  blockchainId: string;
  name: string;
  lowThreshold: number;
  logo: string;
  highThreshold: number;
  userId: string;
  currentValue?: number;
}

// Type definition for dashboard item (used in hover effect)
interface DashboardHoverItem {
  id: string;
  name: string;
  thresholdMin: number;
  thresholdMax: number;
  userId: string;
  currentValue: number;
}

// Type definition for update values
interface UpdateValues {
  lowThreshold: string;
  highThreshold: string;
  notifications: boolean;
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
              thresholdMin: item.lowThreshold,
              thresholdMax: item.highThreshold,
              logo: item.logo,
              userId: item.userId,
              currentValue: 94000,
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