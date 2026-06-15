"use client";

import { useLendingPool } from "@/hooks/useLendingPool";

export function PoolStats() {
  const { totalDeposited, totalBorrowed, availableLiquidity } = useLendingPool();

  const stats = [
    { label: "Total Deposited", value: `${parseFloat(totalDeposited).toFixed(2)} cUSD` },
    { label: "Total Borrowed", value: `${parseFloat(totalBorrowed).toFixed(4)} CELO` },
    { label: "Available Liquidity", value: `${parseFloat(availableLiquidity).toFixed(4)} CELO` },
    { label: "APR (Borrowing)", value: "5%" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs">{s.label}</p>
          <p className="text-white font-bold mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
