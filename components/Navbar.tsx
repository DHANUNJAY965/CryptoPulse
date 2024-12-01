import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
// import { UserMenu } from "./user-menu";
import { UserMenu } from "./user-menu";
import { useSession } from "next-auth/react";

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
  onSignIn?: () => void; // Callback for Sign In button
}

export function Navbar({ userName, onLogout, onSignIn }: NavbarProps) {
  const session = useSession();
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b bg-background/95"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-primary" />
            <span
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent hover:text-primary transition-colors"
              role="heading"
              aria-level={1}
            >
              CryptoPulse
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <UserMenu userName={userName} onLogout={onLogout!} />
            ) : (
              <Button
                variant="default"
                onClick={onSignIn}
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
