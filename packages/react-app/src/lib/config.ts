import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [celoAlfajores, celo],
  transports: {
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
    [celo.id]: http("https://forno.celo.org"),
  },
  ssr: true,
});

// cUSD contract addresses
export const CUSD_ADDRESS: Record<number, `0x${string}`> = {
  [celoAlfajores.id]: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  [celo.id]: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
};

// LendingPool deployed addresses (updated after deploy)
export const LENDING_POOL_ADDRESS: Record<number, `0x${string}`> = {
  [celoAlfajores.id]: "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822",
  [celo.id]: "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822",
};

export const LENDING_POOL_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "celoAmount", type: "uint256" }],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "repay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getAccount",
    outputs: [
      { internalType: "uint256", name: "depositedcUSD", type: "uint256" },
      { internalType: "uint256", name: "borrowedCELO", type: "uint256" },
      { internalType: "uint256", name: "maxBorrowCELO", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolInfo",
    outputs: [
      { internalType: "uint256", name: "totalDeposited", type: "uint256" },
      { internalType: "uint256", name: "totalBorrowed", type: "uint256" },
      { internalType: "uint256", name: "availableLiquidity", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "COLLATERAL_RATIO",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
