"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DepositCard } from "@/components/DepositCard";
import { BorrowCard } from "@/components/BorrowCard";
import { PoolStats } from "@/components/PoolStats";
import { CeloIcon, CUSDIcon } from "@/components/TokenIcon";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen" style={{ background: "#060912" }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(53,208,127,0.06) 0%, transparent 65%)"
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "-200px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(251,204,92,0.04) 0%, transparent 65%)"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-150px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(96,165,250,0.04) 0%, transparent 65%)"
        }} />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-10 sm:space-y-14" style={{ zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="animate-fade-up text-center space-y-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="badge badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] pulse-dot" />
              Live on Celo Mainnet
            </span>
            <span className="badge badge-gray">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#35D07F" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Non-Custodial
            </span>
            <span className="badge badge-gold">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FBCC5C" strokeWidth="2.5">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round"/>
              </svg>
              MiniPay Ready
            </span>
            <span className="badge badge-gray">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              Open Source
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight">
              The Lending Protocol<br/>
              <span className="gradient-text">Built for CELO</span>
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
              Deposit cUSD stablecoin as collateral and borrow CELO instantly.
              No KYC. No centralized counterparty. <span className="text-white font-semibold">5% fixed APR.</span>
            </p>
          </div>

          {/* Token pair visual */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "#0C1120", border: "1px solid #182030" }}>
              <CUSDIcon size={22} />
              <span className="text-sm font-bold text-white">cUSD</span>
              <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium" style={{ background: "rgba(53,208,127,0.1)", color: "#35D07F" }}>Collateral</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "#0C1120", border: "1px solid #182030" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "#0C1120", border: "1px solid #182030" }}>
              <CeloIcon size={22} />
              <span className="text-sm font-bold text-white">CELO</span>
              <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium" style={{ background: "rgba(251,204,92,0.1)", color: "#FBCC5C" }}>Borrow</span>
            </div>
          </div>

          {/* Key stats inline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden w-full sm:w-auto sm:inline-grid" style={{ border: "1px solid #182030" }}>
            {[
              { label: "Collateral Ratio", value: "150%" },
              { label: "Borrow APR", value: "5.00%" },
              { label: "Gas Fee", value: "~$0.001" },
              { label: "Settlement", value: "Instant" },
            ].map((s, i) => (
              <div key={s.label} className="px-4 py-3 text-center"
                style={{
                  background: "#0C1120",
                  borderRight: (i === 1 || i === 3) ? "none" : "1px solid #182030",
                  borderBottom: i < 2 ? "1px solid #182030" : "none",
                }}>
                <p className="text-sm font-extrabold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#4A5568" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Connect Wallet */}
          {!isConnected && (
            <div className="flex justify-center">
              <ConnectButton chainStatus="none" showBalance={false} />
            </div>
          )}
        </section>

        {/* ── STATS ── */}
        <section id="stats-section">
          <PoolStats />
        </section>

        {/* ── APP ── */}
        {isConnected ? (
          <div id="app-section" className="grid lg:grid-cols-2 gap-5 animate-fade-up-3">
            <div id="lend-section"><DepositCard /></div>
            <div id="borrow-section"><BorrowCard /></div>
          </div>
        ) : (
          <div className="animate-fade-up-3 rounded-2xl overflow-hidden"
            style={{ background: "#0C1120", border: "1px solid #182030" }}>
            <div className="relative py-20 px-8 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(53,208,127,0.07), transparent)" }} />
              <div className="relative space-y-5">
                <div className="flex items-center justify-center gap-3 float">
                  <div className="p-3 rounded-2xl" style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.2)" }}>
                    <CUSDIcon size={32} />
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#182030" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <div className="p-3 rounded-2xl" style={{ background: "rgba(251,204,92,0.1)", border: "1px solid rgba(251,204,92,0.2)" }}>
                    <CeloIcon size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Connect to Start Lending</h3>
                  <p className="text-sm mt-1.5" style={{ color: "#4A5568" }}>
                    View your positions, deposit collateral, and borrow CELO
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "#4A5568" }}>
                  {["Non-custodial", "Permissionless", "On-chain"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#35D07F"><path d="M20 6L9 17l-5-5" stroke="#35D07F" fill="none" strokeWidth="3"/></svg>
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#4A5568" }}>
                  Use the <span style={{ color: "#94a3b8" }}>Connect Wallet</span> button in the top right
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        <section className="space-y-6 animate-fade-up-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-extrabold text-white shrink-0">How It Works</h2>
            <div className="flex-1 h-px" style={{ background: "#182030" }} />
            <span className="text-xs shrink-0 font-medium" style={{ color: "#4A5568" }}>3 simple steps</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n:"01", title:"Deposit cUSD", desc:"Lock cUSD as collateral in the smart contract. Your funds remain fully under your control — no intermediaries.", color:"#35D07F", icon:<CUSDIcon size={28}/> },
              { n:"02", title:"Borrow CELO", desc:"Instantly receive CELO up to 66% of your collateral value. 5% APR accrued per second, repay anytime.", color:"#FBCC5C", icon:<CeloIcon size={28}/> },
              { n:"03", title:"Repay & Reclaim", desc:"Pay back your CELO loan whenever you're ready. No fixed terms. Withdraw full collateral instantly after repayment.", color:"#60a5fa", icon:(
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                  <path d="M3 12a9 9 0 1018 0A9 9 0 003 12z"/><path d="M12 8v4l3 3"/>
                </svg>
              )},
            ].map((s) => (
              <div key={s.n} className="card card-lift p-6 relative overflow-hidden cursor-default">
                <span className="absolute -top-2 -right-2 text-7xl font-black select-none" style={{ color: `${s.color}06` }}>{s.n}</span>
                <div className="p-3 rounded-2xl w-fit mb-5" style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>{s.desc}</p>
                <div className="mt-4 h-0.5 rounded-full" style={{ background: `${s.color}20` }}>
                  <div className="w-8 h-full rounded-full" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RISK ── */}
        <div className="rounded-2xl p-5 flex gap-4"
          style={{ background: "rgba(251,204,92,0.04)", border: "1px solid rgba(251,204,92,0.1)" }}>
          <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: "rgba(251,204,92,0.1)", border: "1px solid rgba(251,204,92,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBCC5C" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: "#FBCC5C" }}>Risk Disclosure</p>
            <p className="text-xs leading-relaxed" style={{ color: "#4A5568" }}>
              DeFi lending carries inherent risks including smart contract vulnerabilities, price volatility, and liquidation risk.
              If your health factor drops below 1.0, your collateral may be at risk. Only deposit what you can afford to lose.
              This protocol has not been formally audited. Use at your own risk.
            </p>
          </div>
        </div>

        {/* ── CONTRACT ── */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.15)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#35D07F" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "#4A5568" }}>Smart Contract · Celo Mainnet</p>
              <p className="font-mono text-xs text-white">0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822</p>
            </div>
          </div>
          <a href="https://celoscan.io/address/0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822"
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.2)", color: "#35D07F" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(53,208,127,0.15)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(53,208,127,0.1)")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View on Celoscan
          </a>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #182030", marginTop: "80px" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #35D07F, #28C470)" }}>
              <span className="text-black font-black text-xs">CL</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">CeloLend</p>
              <p className="text-xs" style={{ color: "#4A5568" }}>Decentralized Lending Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: "#4A5568" }}>
            <a href="https://celoscan.io/address/0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822"
              target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors">Contract</a>
            <a href="https://celo.org" target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors">celo.org</a>
            <span>CELO Proof of Ship 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
