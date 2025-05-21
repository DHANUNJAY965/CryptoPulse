// "use client";
// import { useSession, signOut } from "next-auth/react";
// import { redirect } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { Navbar } from "@/components/Navbar";
// import { BackgroundLines } from "@/components/ui/background-lines";
// import axios from "axios";
// import CryptoHoverEffect from "@/components/ui/card-hover-effect";
// import { AuthDialog } from "@/components/auth-dialog";

// // Type definition for blockchain item from API
// interface BlockchainItem {
//   blockchainId: string;
//   name: string;
//   targetPrice: number;
//   logo: string;
//   alertMode: string;
//   userId: string;
//   symbol: string;
//   currentValue?: number;
// }

// // Type definition for dashboard item (used in hover effect)
// interface DashboardHoverItem {
//   id: string;
//   name: string;
//   targetPrice: number;
//   alertMode: string;
//   logo: string;
//   userId: string;
//   symbol: string;
//   currentValue: number;
// }

// function Dashboard() {
//   const { data: session } = useSession({
//     required: true,
//     onUnauthenticated() {
//       redirect("/");
//     },
//   });

//   const [blockchains, setBlockchains] = useState<DashboardHoverItem[]>([]);
//   const [showAuthDialog, setShowAuthDialog] = useState(false);
  
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchBlockchains = async () => {
//       try {
//         const response = await axios.get("/api/user");
//         if (response.data) {
//           const data: DashboardHoverItem[] = response.data.map((item: BlockchainItem) => {
//             return {
//               id: item.blockchainId,
//               name: item.name,
//               targetPrice: item.targetPrice,
//               alertMode: item.alertMode || "once", // Default to "once" if not provided
//               logo: item.logo,
//               userId: item.userId,
//               symbol: item.symbol || "",
//               currentValue: item.currentValue || 0,
//             };
//           });
//           setBlockchains(data);
//           console.log("Fetched blockchains:", data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch blockchains:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load blockchains",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchBlockchains();
//   }, [toast]);

//   const handleSignIn = () => {
//     console.log("Sign in clicked");
//     setShowAuthDialog(true);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar 
//         userName={session?.user?.name}
//         onSignIn={handleSignIn}
//         onLogout={() => signOut()}
//       />
      
//       <BackgroundLines>
//         <div className="container pt-24 mx-auto py-8">
//           <h1 className="text-4xl font-bold mb-8">
//             Welcome to dashboard{session?.user?.name ? `, ${session.user.name}` : ''}!
//           </h1>
//           {blockchains.length > 0 ? (
//             <CryptoHoverEffect items={blockchains} />
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-xl text-muted-foreground">No cryptocurrency alerts set up yet.</p>
//               <p className="mt-2">Visit the explorer to add some cryptocurrencies to your watchlist.</p>
//             </div>
//           )}
//         </div>
//       </BackgroundLines>

//       {showAuthDialog && (
//         <AuthDialog 
//           onClose={() => setShowAuthDialog(false)} 
//           onSuccessfulAuth={() => {
//             setShowAuthDialog(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default Dashboard;

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
import { ThresholdForm } from "@/components/ThresholdForm";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState<any>(null);
  
  const { toast } = useToast();

  const fetchBlockchains = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/user");
      if (response.data) {
        // Get current prices for all cryptocurrencies
        const coinIds = response.data.map((item: BlockchainItem) => item.blockchainId).join(",");
        const priceResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );

        const data: DashboardHoverItem[] = response.data.map((item: BlockchainItem) => {
          return {
            id: item.blockchainId,
            name: item.name,
            targetPrice: item.targetPrice,
            alertMode: item.alertMode || "once",
            logo: item.logo,
            userId: item.userId,
            symbol: item.symbol || "",
            currentValue: priceResponse.data[item.blockchainId]?.usd || 0,
          };
        });
        setBlockchains(data);
      }
    } catch (error) {
      console.error("Failed to fetch blockchains:", error);
      toast({
        title: "Error",
        description: "Failed to load your cryptocurrency alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchains();
  }, [toast]);

  const handleSignIn = () => {
    setShowAuthDialog(true);
  };

  const handleEditAlert = (blockchain: DashboardHoverItem) => {
    setSelectedBlockchain({
      id: blockchain.id,
      name: blockchain.name,
      symbol: blockchain.symbol,
      current_price: blockchain.currentValue,
      image: blockchain.logo
    });
    setShowEditForm(true);
  };

  const handleUpdateAlert = async (data: any) => {
    try {
      // console.log("Updating alert with data:", data);
      await axios.put("/api/updatethreshold", data);
      toast({
        title: "Success",
        description: "Price alert updated successfully",
      });
      setShowEditForm(false);
      fetchBlockchains(); // Refresh the list
    } catch (error) {
      console.error("Failed to update price alert:", error);
      toast({
        title: "Error",
        description: "Failed to update price alert",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900">
      <Navbar 
        userName={session?.user?.name}
        onSignIn={handleSignIn}
        onLogout={() => signOut()}
      />
      
      <BackgroundLines>
        <div className="container pt-24 mx-auto py-8 px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Your Crypto Alerts Dashboard
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Monitor your cryptocurrency price alerts in real-time. Get notified when prices hit your specified targets.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : blockchains.length > 0 ? (
            <CryptoHoverEffect 
              items={blockchains} 
              onEdit={handleEditAlert}
            />
          ) : (
            <div className="text-center py-16 bg-black/20 rounded-2xl backdrop-blur-sm border border-gray-800">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No price alerts set up yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Visit the explorer section to add cryptocurrencies and set up price alerts to monitor their performance.
              </p>
              <button 
                onClick={() => redirect("/explorer")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
              >
                Explore Cryptocurrencies
              </button>
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

      {showEditForm && selectedBlockchain && (
        <ThresholdForm
          blockchain={selectedBlockchain}
          onSubmit={handleUpdateAlert}
          onClose={() => setShowEditForm(false)}
          isEditing={true}
        />
      )}
    </div>
  );
}

export default Dashboard;