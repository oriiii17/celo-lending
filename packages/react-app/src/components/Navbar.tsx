"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { celoAlfajores, celo } from "wagmi/chains";
import { isMiniPay } from "@/lib/minipay";

export function Navbar() {
  const { address } = useAccount();
  const chainId = useChainId();
  const miniPay = typeof window !== "undefined" && isMiniPay();

  const isCorrectNetwork = chainId === celoAlfajores.id || chainId === celo.id;

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-celo-green to-celo-gold flex items-center justify-center text-black font-bold text-sm">
            CL
          </div>
          <span className="font-bold text-lg text-white">CeloLend</span>
          {miniPay && (
            <span className="text-xs bg-celo-green/20 text-celo-green px-2 py-0.5 rounded-full border border-celo-green/30">
              MiniPay
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {address && !isCorrectNetwork && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
              Switch to CELO network
            </span>
          )}
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
