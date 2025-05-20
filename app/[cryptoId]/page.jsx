"use client";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import navLogo from "../images/cryptocurrencies.png";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

const timeframes = [
  { label: "24H", value: "1", days: "1" },
  { label: "7D", value: "7", days: "7" },
  { label: "1M", value: "30", days: "30" },
  { label: "3M", value: "90", days: "90" },
  { label: "1Y", value: "365", days: "365" },
];

const CryptoDetailView = () => {
  const params = useParams();
  const { cryptoId } = params;
  const [cryptoData, setCryptoData] = useState(null);
  const nav = useRouter();
  const [priceData, setPriceData] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatTimestamp = (timestamp, timeframe) => {
    const date = new Date(timestamp);
    if (timeframe === "1") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (timeframe === "7" || timeframe === "30") {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`
        );
        if (!response.ok) throw new Error("Failed to fetch crypto data");
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        setError("Failed to load crypto data. Please try again later.");
        console.error("Error fetching crypto data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCryptoData();
  }, [cryptoId, currency]);

  function formatVolume(num) {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + "T";
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    } else {
      return num.toString();
    }
  }

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const timeframe = timeframes.find((t) => t.value === selectedTimeframe);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currency}&days=${timeframe.days}`
        );
        if (!response.ok) throw new Error("Failed to fetch price history");
        const data = await response.json();
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: formatTimestamp(timestamp, timeframe.value),
          price: formatPrice(price),
          timestamp, // Keep timestamp for tooltip
        }));
        setPriceData(formattedData);
      } catch (error) {
        setError("Failed to load price history. Please try again later.");
        console.error("Error fetching price history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPriceHistory();
  }, [cryptoId, selectedTimeframe, currency]);

  if (isLoading && !cryptoData) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <Card className="w-full max-w-md dark:bg-gray-800">
          <CardContent className="p-6">
            <p className="text-red-500 dark:text-red-400 text-center">
              {"Rate limits for coin gecko website"}
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cryptoData) return null;

  const priceChangeColor =
    cryptoData.market_data?.price_change_percentage_24h >= 0
      ? "text-green-500"
      : "text-red-500";

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium dark:text-white">
            Price: {payload[0].value}
            {currency?.toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {payload[0].payload.date}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-[5.5rem] pb-8 dark:bg-black transition-colors duration-200">
      <Navbar />
      <div className="mx-16 border-2 rounded-lg dark:border-gray-700 p-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={cryptoData.image.large}
              alt={cryptoData.name}
              className="w-16 h-16"
            />
            <div>
              <h1 className="text-3xl font-bold dark:text-white">
                {cryptoData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {cryptoData.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          <Button className="dark:bg-white dark:text-black bg-black text-white hover:none">
            Add to Price Alerts
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800 transition-colors duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Price
                  </p>
                  <h2 className="text-2xl font-bold dark:text-white">
                    {formatPrice(
                      cryptoData.market_data.current_price[currency]
                    )}
                    {currency?.toUpperCase()}
                  </h2>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    24h Change
                  </p>
                  <h2 className={`text-2xl font-bold ${priceChangeColor}`}>
                    {cryptoData.market_data.price_change_percentage_24h.toFixed(
                      2
                    )}
                    %
                  </h2>
                </div>
                {cryptoData.market_data.price_change_percentage_24h >= 0 ? (
                  <ArrowUp className="h-8 w-8 text-green-500" />
                ) : (
                  <ArrowDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Market Cap
                  </p>
                  <h2 className="text-2xl font-bold dark:text-white">
                    {formatVolume(cryptoData.market_data.market_cap[currency])}
                  </h2>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 dark:bg-gray-800">
          <Box sx={{ padding: "1.5rem" }}>
            <Typography
              className="dark:text-white"
              style={{ fontSize: "1.5rem", fontWeight: 600 }}
            >
              Price History
            </Typography>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 mt-2 flex-wrap">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe.value}
                    // variant="outline"
                    className={
                      "dark:text-slate-700 border-2 border-black dark:border-white dark:hover:border-black hover:bg-white hover:text-black hover:dark:bg-black hover:dark:text-white" +
                      `${
                        selectedTimeframe === timeframe.value
                          ? "text-black"
                          : ""
                      }`
                    }
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                  >
                    {timeframe.label}
                  </Button>
                ))}
              </div>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="dark:bg-gray-700 dark:text-white outline-none border-none ring-0"
              >
                <MenuItem value="inr">INR</MenuItem>
                <MenuItem value="usd">USD</MenuItem>
                <MenuItem value="eur">EUR</MenuItem>
                <MenuItem value="gbp">GBP</MenuItem>
                <MenuItem value="jpy" className="hidden">
                  JPY
                </MenuItem>
                <MenuItem value="cad" className="hidden">
                  CAD
                </MenuItem>
                <MenuItem value="aud" className="hidden">
                  AUD
                </MenuItem>
                <MenuItem value="chf">CHF</MenuItem>
                <MenuItem value="cny">CNY</MenuItem>
                <MenuItem value="hkd">HKD</MenuItem>
                <MenuItem value="nzd" className="hidden">
                  NZD
                </MenuItem>
                <MenuItem value="sgd" className="hidden">
                  SGD
                </MenuItem>
                <MenuItem value="sek" className="hidden">
                  SEK
                </MenuItem>
                <MenuItem value="try">TRY</MenuItem>
                <MenuItem value="twd">TWD</MenuItem>
              </Select>
            </div>
          </Box>
          <CardContent>
            <div className="h-[60vh]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="date"
                    interval="preserveStartEnd"
                    minTickGap={50}
                    className="dark:text-gray-400"
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${formatPrice(value)}`}
                    className="dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <Typography className="dark:text-white">Market Stats</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    24h Trading Volume
                  </span>
                  <span className="font-medium dark:text-white">
                    ${cryptoData.market_data.total_volume.usd.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Circulating Supply
                  </span>
                  <span className="font-medium dark:text-white">
                    {cryptoData.market_data.circulating_supply.toLocaleString()}{" "}
                    {cryptoData.symbol.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Supply
                  </span>
                  <span className="font-medium dark:text-white">
                    {cryptoData.market_data.total_supply
                      ? cryptoData.market_data.total_supply.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Max Supply
                  </span>
                  <span className="font-medium dark:text-white">
                    {cryptoData.market_data.max_supply
                      ? cryptoData.market_data.max_supply.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <Typography className="dark:text-white">Price Changes</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["1h", "24h", "7d", "30d", "1y"].map((period) => (
                  <div key={period} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {period.toUpperCase()} Change
                    </span>
                    <span
                      className={
                        cryptoData.market_data[
                          `price_change_percentage_${period}`
                        ] >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {cryptoData.market_data[
                        `price_change_percentage_${period}`
                      ]?.toFixed(2)}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailView;
