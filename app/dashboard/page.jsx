
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import navLogo from "../images/cryptocurrencies.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";
import Navbar from "@/components/ui/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";

import CryptoHoverEffect from "../../components/ui/card-hover-effect";

function Dashboard() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [blockchains, setBlockchains] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] =
    useState(null);
  const [updateValues, setUpdateValues] = useState({
    lowThreshold: "",
    highThreshold: "",
    notifications: true,
  });

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBlockchains = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.data) {
          const data = response.data.map((item) => {
            return {
              id: item.blockchainId,
              name: item.name,
              thresholdMin: item.lowThreshold,
              thresholdMax: item.highThreshold,
              userId: item.userId,
              currentValue: 94000,
            };
          });
          setBlockchains(data);
          console.log("hii there");
          console.log(data);
        }
      } catch (error) {
        console.error("Failed to fetch blockchains:", error);
      }
    };

    fetchBlockchains();
  }, []);

  const handleDelete = async (blockchainId) => {
    try {
      const response = await fetch(
        `/api/blockchain?blockchainId=${blockchainId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blockchain");
      }

      setBlockchains(
        blockchains.filter((b) => b.blockchainId !== blockchainId)
      );

      toast({
        title: "Success",
        description: "Blockchain removed from watchlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove blockchain",
        variant: "destructive",
      });
    }
  };

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
