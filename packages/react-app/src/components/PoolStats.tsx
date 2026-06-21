"use client";

import { useLendingPool } from "@/hooks/useLendingPool";
import { CeloIcon, CUSDIcon } from "./TokenIcon";

export function PoolStats() {
  const { totalDeposited, totalBorrowed, availableLiquidity } = useLendingPool();

  const stats = [
    {
      label: "Total Value Locked",
      value: `$${parseFloat(totalDeposited).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+0.00%",
      positive: true,
      icon: <CUSDIcon size={20} />,
      sub: "cUSD deposited",
      accent: "#35D07F",
    },
    {
      label: "Total Borrowed",
      value: `${parseFloat(totalBorrowed).toFixed(4)} CELO`,
      change: "Active loans",
      positive: true,
      icon: <CeloIcon size={20} />,
      sub: "Outstanding debt",
      accent: "#FBCC5C",
    },
    {
      label: "Available Liquidity",
      value: `${parseFloat(availableLiquidity).toFixed(4)} CELO`,
      change: "Ready to borrow",
      positive: true,
      icon: <CeloIcon size={20} />,
      sub: "Borrow capacity",
      accent: "#60a5fa",
    },
    {
      label: "Borrow APR",
      value: "5.00%",
      change: "Fixed rate",
      positive: true,
      icon: (
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}>
          <span className="text-white text-xs font-black">%</span>
        </div>
      ),
      sub: "Per annum",
      accent: "#a78bfa",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up-2">
      {stats.map((s) => (
        <div key={s.label} className="card card-lift p-4 sm:p-5 cursor-default overflow-hidden">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-xl" style={{ background: `${s.accent}12`, border: `1px solid ${s.accent}25` }}>
              {s.icon}
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-lg hidden sm:block"
              style={{ background: `${s.accent}10`, color: s.accent }}>
              {s.change}
            </span>
          </div>

          {/* Value */}
          <p className="text-lg sm:text-2xl font-extrabold text-white leading-none mb-1 truncate">{s.value}</p>
          <p className="text-xs" style={{ color: "#4A5568" }}>{s.label}</p>

          {/* Bottom bar */}
          <div className="mt-4 h-0.5 rounded-full" style={{ background: `${s.accent}20` }}>
            <div className="h-full rounded-full w-3/4" style={{ background: `linear-gradient(90deg, ${s.accent}, ${s.accent}60)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
