"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { celo } from "wagmi/chains";
import { formatEther } from "viem";
import { useState } from "react";
import { isMiniPay } from "@/lib/minipay";
import { CeloIcon } from "./TokenIcon";

const NAV_ITEMS = [
  { label: "Lend", sectionId: "lend-section" },
  { label: "Borrow", sectionId: "borrow-section" },
  { label: "Dashboard", sectionId: "stats-section" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function Navbar() {
  const { address } = useAccount();
  const miniPay = typeof window !== "undefined" && isMiniPay();
  const { data: bal } = useBalance({ address, chainId: celo.id });
  const [activeNav, setActiveNav] = useState("Lend");

  function handleNav(item: { label: string; sectionId: string }) {
    setActiveNav(item.label);
    scrollTo(item.sectionId);
  }

  return (
    <nav style={{ background: "rgba(6,9,18,0.85)", borderBottom: "1px solid #182030" }}
      className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.svg" alt="CeloLend" className="w-9 h-9" />
          <div className="hidden sm:block">
            <p className="text-white font-bold text-base leading-none tracking-tight">CeloLend</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: "#4A5568" }}>Decentralized Lending</p>
          </div>
        </div>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: "#0C1120", border: "1px solid #182030" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: activeNav === item.label ? "#fff" : "#4A5568",
                background: activeNav === item.label ? "#182030" : "transparent",
              }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Network pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "#0C1120", border: "1px solid #182030" }}>
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "#35D07F" }} />
            <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>Celo Mainnet</span>
          </div>

          {/* Balance */}
          {address && bal && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "#0C1120", border: "1px solid #182030" }}>
              <CeloIcon size={14} />
              <span className="text-xs font-semibold text-white">
                {parseFloat(formatEther(bal.value)).toFixed(2)}
              </span>
            </div>
          )}

          {miniPay && (
            <span className="badge badge-gold text-xs">MiniPay</span>
          )}

          <ConnectButton chainStatus="none" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
