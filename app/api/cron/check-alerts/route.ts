import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";
import axios from "axios";
import { ObjectId } from "mongodb";

const CRON_SECRET = process.env.NEXTAUTH_SECRET || "your-secure-token";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function POST(req: Request) {
  const token = req.headers.get("authorization");
  if (token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("blockpulse");

  const alerts = await db.collection("thresholds").find({}).toArray();
  if (!alerts.length) {
    return NextResponse.json({ message: "No alerts to check." });
  }

  const uniqueTokens = [...new Set(alerts.map((a) => a.blockchainId))];

  const { data: prices } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: uniqueTokens.join(","),
        vs_currencies: "usd",
      },
    }
  );

  let notified = 0;

  for (const alert of alerts) {
    const currentPrice = prices[alert.blockchainId]?.usd;
    const targetPrice = parseFloat(alert.targetPrice);

    if (!currentPrice) continue;

    const priceMatch =
      Number(currentPrice.toFixed(2)) === Number(targetPrice.toFixed(2));

    console.log(
      `Checking alert for ${alert.name}: current price is $${currentPrice}, target price is $${targetPrice}, match: ${priceMatch}`
    );

    if (!priceMatch) continue;

    const now = new Date();
    const lastSent = alert.updatedAt ? new Date(alert.updatedAt) : null;
    const hoursSinceLast = lastSent
      ? (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60)
      : Infinity;

    try {
      if (alert.alertMode === "once") {
        await sendEmail(alert, currentPrice);
        await db.collection("thresholds").deleteOne({ _id: new ObjectId(alert._id) });
        notified++;
      } else if (alert.alertMode === "recurring" && hoursSinceLast >= 6) {
        await sendEmail(alert, currentPrice);
        await db.collection("thresholds").updateOne(
          { _id: new ObjectId(alert._id) },
          { $set: { updatedAt: now } }
        );
        notified++;
      }
    } catch (error: any) {
      console.error(`Failed to send email to ${alert.email}:`, error);
      await db.collection("email_failures").insertOne({
        alertId: alert._id,
        email: alert.email,
        error: error.message || String(error),
        createdAt: new Date(),
      });
    }
  }

  return NextResponse.json({
    message: `Processed ${alerts.length} alerts.`,
    notified,
  });
}

async function sendEmail(alert: any, currentPrice: number) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: alert.email,
    subject: `📈 ${alert.name} hit $${currentPrice}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">🚨 Crypto Price Alert</h2>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${alert.logo}" alt="${alert.name}" width="60" style="border-radius: 10px;" />
          <h3 style="margin: 10px 0;">${alert.name} (${alert.symbol.toUpperCase()})</h3>
        </div>
        <p style="font-size: 16px; color: #444;">🎯 <b>Target Price Reached:</b> <span style="color: green;">$${alert.targetPrice}</span></p>
        <p style="font-size: 16px; color: #444;">📊 <b>Current Price:</b> <span style="color: blue;">$${currentPrice}</span></p>
        <p style="font-size: 16px; color: #444;">🔁 <b>Alert Mode:</b> ${alert.alertMode}</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 14px; color: #777; text-align: center;">
          You received this alert because you set a price threshold on 
          <a href="https://crypto-pulse-hack.vercel.app/" style="color: #777; text-decoration: underline;"><b>CryptoAlert</b></a>.
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 10px;">
          If you don't need any more alerts for this coin, please delete or deactivate this alert through the 
          <a href="https://crypto-pulse-hack.vercel.app/" style="color: #777; text-decoration: underline;">CryptoAlert website</a>.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error; // allow outer try-catch to handle it
  }
}

