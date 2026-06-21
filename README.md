# CeloLend — DeFi Lending Protocol on Celo

A decentralized lending protocol built on the Celo blockchain. Deposit cUSD stablecoin as collateral and borrow CELO instantly — no KYC, no intermediaries.

**Live App:** https://celo-lending-react-app.vercel.app  
**Smart Contract:** [0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822](https://celoscan.io/address/0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822)

---

## What is CeloLend?

CeloLend is a non-custodial lending protocol that allows users to:

- **Deposit** cUSD (Celo Dollar) stablecoin as collateral
- **Borrow** CELO native token against their collateral
- **Repay** loans anytime with no fixed terms
- **Withdraw** collateral after repayment

All operations happen on-chain via smart contracts. Your funds are never held by a third party.

---

## How It Works

### 1. Deposit cUSD
Lock cUSD as collateral in the LendingPool smart contract. The 150% collateral ratio ensures protocol solvency.

### 2. Borrow CELO
Borrow up to 66% of your collateral value in CELO. Interest accrues at 5% APR, calculated per second on-chain.

### 3. Repay & Withdraw
Repay your CELO loan at any time. Once repaid, withdraw your full cUSD collateral instantly.

---

## Key Parameters

| Parameter | Value |
|-----------|-------|
| Collateral Token | cUSD (Celo Dollar) |
| Borrow Token | CELO (Native) |
| Collateral Ratio | 150% |
| Borrow APR | 5% fixed |
| Interest Accrual | Per second (on-chain) |
| Liquidation Threshold | Health Factor < 1.0 |
| Network Fee | ~$0.001 |

---

## Health Factor

The health factor measures the safety of your position:

- **> 2.0** — Healthy (green)
- **1.3 – 2.0** — At Risk (yellow)
- **< 1.3** — Danger (red)
- **< 1.0** — Liquidation risk

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.24, OpenZeppelin |
| Development | Hardhat, TypeScript |
| Frontend | Next.js 14, TypeScript |
| Wallet | Wagmi v2, RainbowKit, viem |
| Styling | Tailwind CSS |
| Mobile | MiniPay compatible |
| Network | Celo Mainnet (chainId 42220) |

---

## Smart Contract

**LendingPool.sol** — deployed on Celo Mainnet

```
Address: 0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822
```

### Functions

| Function | Description |
|----------|-------------|
| `deposit(uint256 amount)` | Deposit cUSD as collateral |
| `withdraw(uint256 amount)` | Withdraw cUSD collateral |
| `borrow(uint256 amount)` | Borrow CELO against collateral |
| `repay()` | Repay CELO loan + interest |
| `getAccount(address)` | View account position |
| `getPoolInfo()` | View global pool statistics |

---

## Project Structure

```
celo-lending/
├── packages/
│   ├── hardhat/              # Smart contracts
│   │   ├── contracts/
│   │   │   └── LendingPool.sol
│   │   ├── scripts/
│   │   │   └── deploy.ts
│   │   └── hardhat.config.ts
│   └── react-app/            # Frontend
│       └── src/
│           ├── app/          # Next.js App Router
│           ├── components/   # UI components
│           ├── hooks/        # useLendingPool hook
│           └── lib/          # Config, ABI, MiniPay utils
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start frontend
cd packages/react-app
npm run dev
```

Open http://localhost:3000 and connect your wallet on Celo Mainnet.

---

## MiniPay Support

CeloLend is compatible with [MiniPay](https://www.opera.com/mini/pay) — Opera's mobile wallet built on Celo. The app automatically detects MiniPay and displays a badge when running inside the MiniPay browser.

---

## Built For

**Celo Proof of Ship Hackathon 2026** — DeFi / Lending category

> Celo Proof of Ship is a monthly builder program rewarding developers who ship real projects on the Celo blockchain.
