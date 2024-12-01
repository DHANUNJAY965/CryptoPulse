// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation"; // Corrected import
// import { Navbar } from "../components/Navbar";
// import { AuthDialog } from "@/components/auth-dialog";
// import { BackgroundLines } from "@/components/ui/background-lines";
// import { motion } from "framer-motion";
// import { LineChart, Bell } from "lucide-react";

// export default function Home() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [showAuthDialog, setShowAuthDialog] = useState(false);

//   // Redirect logged-in users to /explore
//   useEffect(() => {
//     if (session) {
//       router.push("/explore");
//     }
//   }, [session, router]);

//   const handleLoginSuccess = () => {
//     setShowAuthDialog(false);
//     router.push("/explore");
//   };

//   // Handle sign-in button click
//   // const handleSignIn = () => {
//   //   setShowAuthDialog(true);
//   // };
//   const handleSignIn = () => {
//     console.log("Sign in clicked");
//     setShowAuthDialog(true); // This triggers the state change to show the dialog
//   };

//   return (
//     <BackgroundLines className="flex flex-col justify-center">
//       {/* Navbar with Sign In handler */}
//       <Navbar userName={session?.user?.name} onSignIn={handleSignIn} />

//       {/* Main content */}
//       <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
//         <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
//           CryptoPulse
//         </h1>
//         <p className="mt-4 font-normal text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-lg">
//           Smarter Alerts for Smarter Investors. Track, Notify, and Analyze Blockchain Prices.
//         </p>
//         {/* <AuthDialog /> */}
//         <AuthDialog

//           onClose={() => setShowAuthDialog(false)}
//           onSuccessfulAuth={handleLoginSuccess}
//         />
//         <div className="flex">
//           <motion.div
//             className="grid md:grid-cols-2 gap-8 mt-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//           >
//             <div className="p-6 border-2 max-w-lg dark:border-none rounded-lg bg-card">
//               <LineChart className="h-12 mx-auto w-12 mb-4 text-primary" />
//               <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
//               <p className="text-muted-foreground">
//                 Monitor cryptocurrency prices in real-time with accurate data and beautiful visualizations.
//               </p>
//             </div>

//             <div className="p-6 max-w-lg border-2 dark:border-none rounded-lg bg-card">
//               <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
//               <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
//               <p className="text-muted-foreground">
//                 Set custom price thresholds and receive instant email notifications when they're triggered.
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Auth Dialog */}
//       {showAuthDialog && <AuthDialog />}
//     </BackgroundLines>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { AuthDialog } from "@/components/auth-dialog";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LineChart, Bell } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const nav = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/explore");
    }
  }, [session, router]);

  const handleLoginSuccess = () => {
    setShowAuthDialog(false);
    router.push("/explore");
  };

  const handleSignIn = () => {
    console.log("Sign in clicked");
    setShowAuthDialog(true); 
  };

  return (
    <BackgroundLines className="flex flex-col justify-center">
      <Navbar userName={session?.user?.name} onSignIn={handleSignIn} />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
          CryptoPulse
        </h1>
        <p className="mt-4 font-normal text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-lg">
          Smarter Alerts for Smarter Investors. Track, Notify, and Analyze
          Blockchain Prices.
        </p>

        <Button onClick={
          () => nav.push("/explore")
        } className="mt-8">Get started</Button>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="p-6 border-2 max-w-lg dark:border-none rounded-lg bg-card">
            <LineChart className="h-12 mx-auto w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor cryptocurrency prices in real-time with accurate data and
              beautiful visualizations.
            </p>
          </div>

          <div className="p-6 max-w-lg border-2 dark:border-none rounded-lg bg-card">
            <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
            <p className="text-muted-foreground">
              Set custom price thresholds and receive instant email
              notifications when they're triggered.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <AuthDialog
          onClose={() => setShowAuthDialog(false)}
          onSuccessfulAuth={handleLoginSuccess}
        />
      )}
    </BackgroundLines>
  );
}
