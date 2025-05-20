"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";
import CryptoHoverEffect from "@/components/ui/card-hover-effect";
import { AuthDialog } from "@/components/auth-dialog";

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
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
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
              currentValue: item.currentValue || 0,
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
  }, [toast]);

  const handleSignIn = () => {
    console.log("Sign in clicked");
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userName={session?.user?.name}
        onSignIn={handleSignIn}
        onLogout={() => signOut()}
      />
      
      <BackgroundLines>
        <div className="container pt-24 mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8">
            Welcome to dashboard{session?.user?.name ? `, ${session.user.name}` : ''}!
          </h1>
          {blockchains.length > 0 ? (
            <CryptoHoverEffect items={blockchains} />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No cryptocurrency alerts set up yet.</p>
              <p className="mt-2">Visit the explorer to add some cryptocurrencies to your watchlist.</p>
            </div>
          )}
        </div>
      </BackgroundLines>

      {showAuthDialog && (
        <AuthDialog 
          onClose={() => setShowAuthDialog(false)} 
          onSuccessfulAuth={() => {
            setShowAuthDialog(false);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;