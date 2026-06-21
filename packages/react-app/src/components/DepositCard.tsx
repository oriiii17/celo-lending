"use client";

import { useState } from "react";
import { useLendingPool } from "@/hooks/useLendingPool";
import { CUSDIcon } from "./TokenIcon";

type Tab = "deposit" | "withdraw";

export function DepositCard() {
  const { depositedcUSD, cUSDBalance, deposit, withdraw } = useLendingPool();
  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const deposited = parseFloat(depositedcUSD);
  const balance = parseFloat(cUSDBalance);
  const maxAmount = tab === "deposit" ? balance : deposited;
  const utilPct = (deposited + balance) > 0 ? (deposited / (deposited + balance)) * 100 : 0;

  async function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      tab === "deposit" ? await deposit(amount) : await withdraw(amount);
      setAmount("");
    } finally { setLoading(false); }
  }

  return (
    <div className="gradient-border">
      <div className="card rounded-[19px] overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4" style={{ borderBottom: "1px solid #182030" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CUSDIcon size={36} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "#35D07F", border: "1.5px solid #060912" }}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none"/></svg>
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-base">cUSD Collateral</p>
                <p className="text-xs" style={{ color: "#4A5568" }}>Celo Dollar · Stablecoin</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "#4A5568" }}>Supply APY</p>
              <p className="text-sm font-bold text-green-400">0.00%</p>
            </div>
          </div>
        </div>

        {/* Position summary */}
        <div className="px-4 sm:px-6 py-4" style={{ borderBottom: "1px solid #182030" }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl" style={{ background: "#060912", border: "1px solid #182030" }}>
              <p className="text-xs mb-2" style={{ color: "#4A5568" }}>Your Deposit</p>
              <div className="flex items-end gap-1">
                <p className="text-xl font-extrabold text-white">{deposited.toFixed(2)}</p>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#35D07F" }}>cUSD</p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#4A5568" }}>≈ ${deposited.toFixed(2)}</p>
            </div>
            <div className="p-3.5 rounded-2xl" style={{ background: "#060912", border: "1px solid #182030" }}>
              <p className="text-xs mb-2" style={{ color: "#4A5568" }}>Wallet</p>
              <div className="flex items-end gap-1">
                <p className="text-xl font-extrabold text-white">{balance.toFixed(2)}</p>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#94a3b8" }}>cUSD</p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#4A5568" }}>Available to deposit</p>
            </div>
          </div>

          {/* Usage bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "#4A5568" }}>
              <span>Deposited ratio</span>
              <span style={{ color: "#35D07F" }}>{utilPct.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#182030" }}>
              <div className="health-bar-fill" style={{ width: `${utilPct}%`, background: "linear-gradient(90deg, #35D07F, #28C470)" }} />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#060912", border: "1px solid #182030" }}>
            {(["deposit", "withdraw"] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setAmount(""); }}
                className={`tab-pill flex-1 capitalize ${tab === t ? "active" : ""}`}>
                {t === "deposit" ? "Deposit" : "Withdraw"}
              </button>
            ))}
          </div>

          {/* Input */}
          <div>
            <div className="flex justify-between text-xs mb-2" style={{ color: "#4A5568" }}>
              <span>Amount</span>
              <button onClick={() => setAmount(maxAmount.toFixed(4))}
                className="font-medium transition-colors hover:text-white"
                style={{ color: "#35D07F" }}>
                MAX {maxAmount.toFixed(4)} cUSD
              </button>
            </div>
            <div className="relative">
              <input
                type="number" placeholder="0.00" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="defi-input pr-24"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <CUSDIcon size={18} />
                <span className="text-sm font-bold text-white">cUSD</span>
              </div>
            </div>

            {/* USD value */}
            {amount && (
              <p className="text-xs mt-1.5 pl-1" style={{ color: "#4A5568" }}>
                ≈ ${parseFloat(amount || "0").toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Info row */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "#060912", border: "1px solid #182030" }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Collateral ratio</span>
              <span className="font-semibold" style={{ color: "#35D07F" }}>150%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Max borrow power</span>
              <span className="font-semibold text-white">66% of deposit</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#4A5568" }}>Network fee</span>
              <span className="font-semibold text-white">~$0.001</span>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !amount || parseFloat(amount) <= 0}
            className={tab === "deposit" ? "btn-green" : "btn-outline"}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirming...
              </span>
            ) : tab === "deposit" ? "Deposit cUSD" : "Withdraw cUSD"}
          </button>
        </div>
      </div>
    </div>
  );
}
