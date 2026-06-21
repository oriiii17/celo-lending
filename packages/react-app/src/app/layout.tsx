import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CeloLend — DeFi Lending on CELO",
  description: "Deposit cUSD as collateral and borrow CELO. MiniPay compatible.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="talentapp:project_verification" content="b116a923d2108a1dcd2556b963c2166ec542454622640a760c993b0693d598703d64e32697f1920c147c13ae9bef3c40c5ff174d232b6c3af956a01e3340f46d" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
