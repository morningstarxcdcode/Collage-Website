import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/button";
import { Shield, Loader2, Smartphone, Globe, XCircle } from "lucide-react";

export const FeePayment: React.FC = () => {
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "mining" | "verified" | "error"
  >("idle");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Mock Fee Data
  const baseAmountINR = 45000;
  const baseAmountUSD = 550;

  const amount = currency === "INR" ? baseAmountINR : baseAmountUSD;

  const handlePayment = async () => {
    try {
      setStatus("processing");
      // 1. Call Backend to Create Intent
      // const { clientSecret, provider } = await api.post('/fees/create-intent', { amount, currency });

      // Simulate Backend Delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate potential error
      if (Math.random() < 0.1) { // 10% chance of error for demo
        throw new Error("Payment gateway error");
      }

      // Payment Success
      setStatus("mining");

      // 3. Call Backend to Verify & Mint
      // await api.post('/fees/verify', { ...paymentData });

      // Simulate Blockchain Transaction (Backend Relayer)
      await new Promise(resolve => setTimeout(resolve, 3000));

      setStatus("verified");
    } catch (error) {
      console.error("Payment failed:", error);
      setStatus("error");
      // Reset after showing error
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Fee Payment</h2>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currency === "INR" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currency === "USD" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            USD ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Invoice Details */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-slate-200 mb-4">
            Invoice #INV-2024-001
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-400">
              <span>Tuition Fee</span>
              <span className="text-white">
                {currency === "INR" ? "₹ 40,000" : "$ 480"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Library Fee</span>
              <span className="text-white">
                {currency === "INR" ? "₹ 2,000" : "$ 25"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Exam Fee</span>
              <span className="text-white">
                {currency === "INR" ? "₹ 3,000" : "$ 45"}
              </span>
            </div>
            <div className="h-px bg-slate-700 my-4" />
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total Due</span>
              <span className="text-cyan-400 font-mono text-2xl">
                {currency === "INR"
                  ? `₹ ${amount.toLocaleString()}`
                  : `$ ${amount}`}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Payment Actions */}
        <GlassCard className="flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />

          {status === "idle" && (
            <>
              <div className="p-4 bg-slate-800 rounded-full relative group">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                <Globe className="w-12 h-12 text-cyan-400 relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Universal Payment Gateway
                </h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                  Pay securely using your preferred local method. Supports UPI,
                  Cards, Apple Pay, and GPay.
                </p>
              </div>

              <div className="w-full space-y-3">
                <Button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-12 text-lg shadow-lg shadow-cyan-500/20"
                >
                  Pay{" "}
                  {currency === "INR"
                    ? `₹ ${amount.toLocaleString()}`
                    : `$ ${amount}`}{" "}
                  Now
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Smartphone className="w-3 h-3" />
                  <span>Deep Links enabled for Mobile Apps</span>
                </div>
              </div>
            </>
          )}

          {status === "processing" && (
            <>
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
              <h3 className="text-xl font-bold text-white">
                Contacting Gateway...
              </h3>
              <p className="text-slate-400 text-sm">
                Detecting best payment route for your region.
              </p>
            </>
          )}

          {status === "mining" && (
            <>
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
              <h3 className="text-xl font-bold text-white">
                Gasless Blockchain Record
              </h3>
              <p className="text-slate-400 text-sm">
                University is verifying payment & minting receipt.
              </p>
              <div className="text-xs font-mono text-purple-400/70 mt-2 bg-purple-900/20 px-2 py-1 rounded">
                Relaying via Polygon Amoy
              </div>
            </>
          )}

          {status === "verified" && (
            <div className="animate-in zoom-in duration-500 w-full">
              <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border border-emerald-500/50 rounded-full animate-pulse" />
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Verified on Blockchain!
              </h3>
              <p className="text-slate-400 text-sm mt-2 mb-8">
                Your generic receipt has been minted and sent to your WhatsApp.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-left mb-6 relative group cursor-pointer hover:border-emerald-500/50 transition-colors">
                <div className="absolute top-2 right-2 text-emerald-500 text-[10px] uppercase font-bold tracking-wider">
                  Immutable
                </div>
                <div className="text-slate-500 mb-1">Transaction Hash</div>
                <div className="text-emerald-400 break-all">
                  0x8f0c439281923849123849128394812390481239
                </div>
              </div>

              <Button
                onClick={() => setStatus("idle")}
                variant="outline"
                className="w-full"
              >
                Download Global Receipt
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="animate-in zoom-in duration-500 w-full">
              <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 relative">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Payment Failed
              </h3>
              <p className="text-slate-400 text-sm mt-2 mb-8">
                There was an error processing your payment. Please try again.
              </p>

              <Button
                onClick={() => setStatus("idle")}
                className="w-full bg-red-600 hover:bg-red-500"
              >
                Try Again
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
