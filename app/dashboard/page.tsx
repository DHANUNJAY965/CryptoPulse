"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [blockchainId, setBlockchainId] = useState("");
  const [thresholds, setThresholds] = useState({
    upper: "",
    lower: "",
  });
  const { toast } = useToast();

  const handleAddBlockchain = async () => {
    try {
      const response = await fetch("/api/blockchain/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockchainId,
          thresholds,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add blockchain");
      }

      toast({
        title: "Success",
        description: "Blockchain added successfully",
      });

      setBlockchainId("");
      setThresholds({ upper: "", lower: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add blockchain",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Blockchain</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Blockchain ID (e.g., "solana")
              </label>
              <Input
                value={blockchainId}
                onChange={(e) => setBlockchainId(e.target.value)}
                placeholder="Enter blockchain ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lower Threshold ($)
                </label>
                <Input
                  type="number"
                  value={thresholds.lower}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, lower: e.target.value })
                  }
                  placeholder="Enter lower threshold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upper Threshold ($)
                </label>
                <Input
                  type="number"
                  value={thresholds.upper}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, upper: e.target.value })
                  }
                  placeholder="Enter upper threshold"
                />
              </div>
            </div>
            <Button onClick={handleAddBlockchain}>Add Blockchain</Button>
          </div>
        </Card>

        {/* Blockchain list will be implemented in the next step */}
      </div>
    </div>
  );
}