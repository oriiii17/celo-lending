"use client";

import { useState } from "react";
import { useLendingPool } from "@/hooks/useLendingPool";

export function DepositCard() {
  const { depositedcUSD, cUSDBalance, deposit, withdraw } = useLendingPool();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDeposit() {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setLoading(true);
    try {
      await deposit(depositAmount);
      setDepositAmount("");
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    setLoading(true);
    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-celo-green" />
        <h2 className="font-semibold text-white">Deposit Collateral</h2>
      </div>

      {/* Stats */}
      <div className="bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Your Deposit</p>
          <p className="text-white font-semibold">{parseFloat(depositedcUSD).toFixed(4)} cUSD</p>
        </div>
        <div>
          <p className="text-gray-400">Wallet Balance</p>
          <p className="text-white font-semibold">{parseFloat(cUSDBalance).toFixed(4)} cUSD</p>
        </div>
      </div>

      {/* Deposit */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Deposit cUSD</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-celo-green"
          />
          <button
            onClick={() => setDepositAmount(parseFloat(cUSDBalance).toFixed(4))}
            className="text-xs text-celo-green hover:text-celo-green/80 px-2"
          >
            MAX
          </button>
        </div>
        <button
          onClick={handleDeposit}
          disabled={loading || !depositAmount}
          className="w-full bg-celo-green hover:bg-celo-green/90 disabled:opacity-40 text-black font-semibold py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </div>

      {/* Withdraw */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Withdraw cUSD</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-celo-green"
          />
          <button
            onClick={() => setWithdrawAmount(parseFloat(depositedcUSD).toFixed(4))}
            className="text-xs text-celo-green hover:text-celo-green/80 px-2"
          >
            MAX
          </button>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading || !withdrawAmount}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}
