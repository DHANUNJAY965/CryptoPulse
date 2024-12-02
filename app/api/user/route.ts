import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log("Unauthorized session:", session);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    // console.log("Received data:", data);
    
    const { blockchainId, name, symbol,logo, lowThreshold, highThreshold, notifications } = data;
      console.log(logo);
    // Validate required fields
    if (!blockchainId || !logo || !name || !symbol || lowThreshold === undefined || highThreshold === undefined) {
      // console.log("Missing required fields:", { blockchainId, name, symbol, lowThreshold, highThreshold });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("blockpulse");
    
    // Check if blockchain already exists in user's watchlist
    const existingBlockchain = await db.collection("thresholds").findOne({
      userId: session.user.id,
      blockchainId: blockchainId,
    });

    if (existingBlockchain) {
      console.log("Blockchain already exists for user:", {
        userId: session.user.id,
        blockchainId,
        existing: existingBlockchain
      });
      return NextResponse.json(
        { error: "Blockchain already in watchlist" },
        { status: 400 }
      );
    }

    const userdetails = await db.collection("users").findOne({
      email: session.user.email
    });

    // console.log("here are the user details : ",userdetails);

    // Add blockchain to watchlist
    const newEntry = {
      userId: session.user.id,
      blockchainId,
      email: userdetails.email,
      name,
      symbol,
      logo,
      lowThreshold: Number(lowThreshold),
      highThreshold: Number(highThreshold),
      notifications,
      createdAt: new Date(),
    };
    // console.log("Attempting to insert:", newEntry);

    const result = await db.collection("thresholds").insertOne(newEntry);
    // console.log("Insert result:", result);

    return NextResponse.json(
      { 
        message: "Blockchain added to watchlist successfully",
        data: result
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to watchlist error:", error);
    return NextResponse.json(
      { 
        error: "Failed to add blockchain to watchlist",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db("blockpulse");
    const thresholds = await db
      .collection("thresholds")
      .find({ userId: session.user.id })
      .toArray();
    return NextResponse.json(thresholds);
  } catch (error) {
    console.error("Get thresholds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch thresholds" },
      { status: 500 }
    );
  }
}