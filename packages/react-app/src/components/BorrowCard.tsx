"use client";

import { useState } from "react";
import { useLendingPool } from "@/hooks/useLendingPool";

function HealthBadge({ factor }: { factor: bigint }) {
  if (factor === 0n) return null;
  const isMax = factor === BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  const num = isMax ? Infinity : Number(factor) / 100;

  const color = num >= 2 ? "text-green-400" : num >= 1.3 ? "text-yellow-400" : "text-red-400";
  const label = isMax ? "∞" : num.toFixed(2);

  return (
    <span className={`font-semibold ${color}`}>
      {label}
    </span>
  );
}

export function BorrowCard() {
  const { borrowedCELO, maxBorrowCELO, celoBalance, healthFactor, borrow, repay } = useLendingPool();
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const maxBorrow = parseFloat(maxBorrowCELO);
  const borrowed = parseFloat(borrowedCELO);

  async function handleBorrow() {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) return;
    setLoading(true);
    try {
      await borrow(borrowAmount);
      setBorrowAmount("");
    } finally {
      setLoading(false);
    }
  }

  async function handleRepay() {
    if (!repayAmount || parseFloat(repayAmount) <= 0) return;
    setLoading(true);
    try {
      await repay(repayAmount);
      setRepayAmount("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-celo-gold" />
        <h2 className="font-semibold text-white">Borrow CELO</h2>
      </div>

      {/* Stats */}
      <div className="bg-gray-800/50 rounded-xl p-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Borrowed</p>
          <p className="text-white font-semibold">{borrowed.toFixed(4)} CELO</p>
        </div>
        <div>
          <p className="text-gray-400">Max Borrow</p>
          <p className="text-white font-semibold">{maxBorrow.toFixed(4)} CELO</p>
        </div>
        <div>
          <p className="text-gray-400">Health Factor</p>
          <HealthBadge factor={healthFactor} />
        </div>
      </div>

      {/* Borrow bar */}
      {maxBorrow > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Utilization</span>
            <span>{Math.min((borrowed / maxBorrow) * 100, 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-celo-green to-celo-gold rounded-full transition-all"
              style={{ width: `${Math.min((borrowed / maxBorrow) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Borrow */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Borrow CELO</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-celo-gold"
          />
          <button
            onClick={() => setBorrowAmount(Math.max(0, maxBorrow - borrowed).toFixed(4))}
            className="text-xs text-celo-gold hover:text-celo-gold/80 px-2"
          >
            MAX
          </button>
        </div>
        <button
          onClick={handleBorrow}
          disabled={loading || !borrowAmount || maxBorrow <= borrowed}
          className="w-full bg-celo-gold hover:bg-celo-gold/90 disabled:opacity-40 text-black font-semibold py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Processing..." : "Borrow"}
        </button>
      </div>

      {/* Repay */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Repay CELO</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-celo-gold"
          />
          <button
            onClick={() => setRepayAmount(borrowed.toFixed(4))}
            className="text-xs text-celo-gold hover:text-celo-gold/80 px-2"
          >
            MAX
          </button>
        </div>
        <button
          onClick={handleRepay}
          disabled={loading || !repayAmount || borrowed === 0}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Processing..." : "Repay"}
        </button>
      </div>
    </div>
  );
}
