"use client";

import { useState } from "react";
import { useLendingPool } from "@/hooks/useLendingPool";
import { CeloIcon } from "./TokenIcon";

type Tab = "borrow" | "repay";

function HealthFactor({ factor }: { factor: bigint }) {
  const isMax = factor === BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  const num = isMax ? 999 : Number(factor) / 100;
  const pct = isMax ? 100 : Math.min((num / 3) * 100, 100);
  const color = num >= 2 ? "#35D07F" : num >= 1.3 ? "#FBCC5C" : "#ef4444";
  const label = isMax ? "∞" : num.toFixed(2);
  const status = isMax ? "Safe" : num >= 2 ? "Healthy" : num >= 1.3 ? "At Risk" : "Danger";

  return (
    <div className="p-4 rounded-2xl" style={{ background: "#060912", border: "1px solid #182030" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-xs font-medium" style={{ color: "#4A5568" }}>Health Factor</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
          style={{ background: `${color}15`, color }}>
          {status}
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-black" style={{ color }}>{label}</span>
        <span className="text-xs" style={{ color: "#4A5568" }}>/ 3.0 safe</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#182030" }}>
        <div className="health-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      </div>
      <p className="text-xs mt-2" style={{ color: "#4A5568" }}>Liquidation threshold: &lt; 1.00</p>
    </div>
  );
}

export function BorrowCard() {
  const { borrowedCELO, maxBorrowCELO, healthFactor, borrow, repay } = useLendingPool();
  const [tab, setTab] = useState<Tab>("borrow");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const borrowed = parseFloat(borrowedCELO);
  const maxBorrow = parseFloat(maxBorrowCELO);
  const available = Math.max(maxBorrow - borrowed, 0);
  const utilPct = maxBorrow > 0 ? Math.min((borrowed / maxBorrow) * 100, 100) : 0;
  const maxAmount = tab === "borrow" ? available : borrowed;

  async function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      tab === "borrow" ? await borrow(amount) : await repay(amount);
      setAmount("");
    } finally { setLoading(false); }
  }

  return (
    <div className="gradient-border">
      <div className="card rounded-[19px] overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid #182030" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CeloIcon size={36} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "#FBCC5C", border: "1.5px solid #060912" }}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-base">CELO Borrow</p>
                <p className="text-xs" style={{ color: "#4A5568" }}>Celo Native Token</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "#4A5568" }}>Borrow APR</p>
              <p className="text-sm font-bold" style={{ color: "#FBCC5C" }}>5.00%</p>
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #182030" }}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3.5 rounded-2xl" style={{ background: "#060912", border: "1px solid #182030" }}>
              <p className="text-xs mb-2" style={{ color: "#4A5568" }}>Borrowed</p>
              <div className="flex items-end gap-1">
                <p className="text-xl font-extrabold text-white">{borrowed.toFixed(4)}</p>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#FBCC5C" }}>CELO</p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#4A5568" }}>
                ≈ ${(borrowed * 0.6).toFixed(2)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl" style={{ background: "#060912", border: "1px solid #182030" }}>
              <p className="text-xs mb-2" style={{ color: "#4A5568" }}>Available</p>
              <div className="flex items-end gap-1">
                <p className="text-xl font-extrabold text-white">{available.toFixed(4)}</p>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#94a3b8" }}>CELO</p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#4A5568" }}>
                Max {maxBorrow.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Borrow meter */}
          {maxBorrow > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "#4A5568" }}>
                <span>Borrow utilization</span>
                <span style={{ color: utilPct > 80 ? "#ef4444" : utilPct > 50 ? "#FBCC5C" : "#35D07F" }}>
                  {utilPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "#182030" }}>
                <div className="health-bar-fill"
                  style={{
                    width: `${utilPct}%`,
                    background: `linear-gradient(90deg, #35D07F, ${utilPct > 80 ? "#ef4444" : "#FBCC5C"})`,
                  }} />
              </div>
            </div>
          )}

          {/* Health factor */}
          <div className="mt-3">
            <HealthFactor factor={healthFactor} />
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#060912", border: "1px solid #182030" }}>
            {(["borrow", "repay"] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setAmount(""); }}
                className={`tab-pill flex-1 capitalize ${tab === t ? "active" : ""}`}>
                {t === "borrow" ? "Borrow" : "Repay"}
              </button>
            ))}
          </div>

          {/* Input */}
          <div>
            <div className="flex justify-between text-xs mb-2" style={{ color: "#4A5568" }}>
              <span>Amount</span>
              <button onClick={() => setAmount(maxAmount.toFixed(4))}
                className="font-medium transition-colors hover:text-white"
                style={{ color: "#FBCC5C" }}>
                MAX {maxAmount.toFixed(4)} CELO
              </button>
            </div>
            <div className="relative">
              <input
                type="number" placeholder="0.0000" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="defi-input pr-24"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <CeloIcon size={18} />
                <span className="text-sm font-bold text-white">CELO</span>
              </div>
            </div>
            {amount && (
              <p className="text-xs mt-1.5 pl-1" style={{ color: "#4A5568" }}>
                ≈ ${(parseFloat(amount || "0") * 0.6).toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "#060912", border: "1px solid #182030" }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Interest rate</span>
              <span className="font-semibold" style={{ color: "#FBCC5C" }}>5.00% APR</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Accrual</span>
              <span className="font-semibold text-white">Per second</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Network fee</span>
              <span className="font-semibold text-white">~$0.001</span>
            </div>
          </div>

          <button onClick={handleSubmit}
            disabled={loading || !amount || parseFloat(amount) <= 0
              || (tab === "borrow" && available <= 0)
              || (tab === "repay" && borrowed === 0)}
            className={tab === "borrow" ? "btn-gold" : "btn-outline"}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirming...
              </span>
            ) : tab === "borrow" ? "Borrow CELO" : "Repay CELO"}
          </button>
        </div>
      </div>
    </div>
  );
}
