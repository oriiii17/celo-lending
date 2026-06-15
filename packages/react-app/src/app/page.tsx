"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { DepositCard } from "@/components/DepositCard";
import { BorrowCard } from "@/components/BorrowCard";
import { PoolStats } from "@/components/PoolStats";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-white">
            DeFi Lending on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celo-green to-celo-gold">
              CELO
            </span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Deposit cUSD as collateral, borrow CELO at 5% APR.
            Works seamlessly with MiniPay.
          </p>
        </div>

        {/* Pool Stats */}
        <PoolStats />

        {!isConnected ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-gray-400">Connect your wallet to start lending</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <DepositCard />
            <BorrowCard />
          </div>
        )}

        {/* How it works */}
        <div className="border-t border-gray-800 pt-8">
          <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Deposit cUSD",
                desc: "Deposit cUSD stablecoin as collateral into the pool. 150% collateral ratio required.",
              },
              {
                step: "2",
                title: "Borrow CELO",
                desc: "Borrow up to 66% of your deposited cUSD value in CELO at 5% annual interest.",
              },
              {
                step: "3",
                title: "Repay & Withdraw",
                desc: "Repay your CELO loan anytime to unlock your cUSD collateral.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-celo-green/20 text-celo-green flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-16 py-6 text-center text-gray-500 text-sm">
        CeloLend — Built for CELO Proof of Ship Hackathon
      </footer>
    </div>
  );
}
