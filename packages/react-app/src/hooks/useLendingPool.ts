"use client";

import { useAccount, useChainId, useReadContract, useWriteContract, useBalance } from "wagmi";
import { parseEther, formatEther, parseUnits, formatUnits } from "viem";
import { celoAlfajores } from "wagmi/chains";
import toast from "react-hot-toast";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, CUSD_ADDRESS, ERC20_ABI } from "@/lib/config";

export function useLendingPool() {
  const { address } = useAccount();
  const chainId = useChainId();

  const lendingPoolAddress = LENDING_POOL_ADDRESS[chainId] ?? LENDING_POOL_ADDRESS[celoAlfajores.id];
  const cUSDAddress = CUSD_ADDRESS[chainId] ?? CUSD_ADDRESS[celoAlfajores.id];

  // Read account info
  const { data: accountData, refetch: refetchAccount } = useReadContract({
    address: lendingPoolAddress,
    abi: LENDING_POOL_ABI,
    functionName: "getAccount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read pool info
  const { data: poolData, refetch: refetchPool } = useReadContract({
    address: lendingPoolAddress,
    abi: LENDING_POOL_ABI,
    functionName: "getPoolInfo",
  });

  // cUSD balance
  const { data: cUSDBalance } = useBalance({
    address,
    token: cUSDAddress,
  });

  // CELO balance
  const { data: celoBalance } = useBalance({ address });

  // cUSD allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: cUSDAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, lendingPoolAddress] : undefined,
    query: { enabled: !!address },
  });

  const { writeContractAsync } = useWriteContract();

  const refetchAll = () => {
    refetchAccount();
    refetchPool();
    refetchAllowance();
  };

  async function approvecUSD(amount: bigint) {
    const toastId = toast.loading("Approving cUSD...");
    try {
      const hash = await writeContractAsync({
        address: cUSDAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [lendingPoolAddress, amount],
      });
      toast.success("cUSD approved!", { id: toastId });
      return hash;
    } catch (e: any) {
      toast.error(e.shortMessage ?? "Approval failed", { id: toastId });
      throw e;
    }
  }

  async function deposit(amountStr: string) {
    const amount = parseUnits(amountStr, 18);
    const toastId = toast.loading("Depositing cUSD...");
    try {
      if (!allowance || allowance < amount) {
        await approvecUSD(amount);
        await refetchAllowance();
      }
      const hash = await writeContractAsync({
        address: lendingPoolAddress,
        abi: LENDING_POOL_ABI,
        functionName: "deposit",
        args: [amount],
      });
      toast.success("Deposited successfully!", { id: toastId });
      refetchAll();
      return hash;
    } catch (e: any) {
      toast.error(e.shortMessage ?? "Deposit failed", { id: toastId });
      throw e;
    }
  }

  async function withdraw(amountStr: string) {
    const amount = parseUnits(amountStr, 18);
    const toastId = toast.loading("Withdrawing cUSD...");
    try {
      const hash = await writeContractAsync({
        address: lendingPoolAddress,
        abi: LENDING_POOL_ABI,
        functionName: "withdraw",
        args: [amount],
      });
      toast.success("Withdrawn successfully!", { id: toastId });
      refetchAll();
      return hash;
    } catch (e: any) {
      toast.error(e.shortMessage ?? "Withdrawal failed", { id: toastId });
      throw e;
    }
  }

  async function borrow(amountStr: string) {
    const amount = parseEther(amountStr);
    const toastId = toast.loading("Borrowing CELO...");
    try {
      const hash = await writeContractAsync({
        address: lendingPoolAddress,
        abi: LENDING_POOL_ABI,
        functionName: "borrow",
        args: [amount],
      });
      toast.success("Borrowed successfully!", { id: toastId });
      refetchAll();
      return hash;
    } catch (e: any) {
      toast.error(e.shortMessage ?? "Borrow failed", { id: toastId });
      throw e;
    }
  }

  async function repay(amountStr: string) {
    const amount = parseEther(amountStr);
    const toastId = toast.loading("Repaying CELO...");
    try {
      const hash = await writeContractAsync({
        address: lendingPoolAddress,
        abi: LENDING_POOL_ABI,
        functionName: "repay",
        value: amount,
      });
      toast.success("Repaid successfully!", { id: toastId });
      refetchAll();
      return hash;
    } catch (e: any) {
      toast.error(e.shortMessage ?? "Repay failed", { id: toastId });
      throw e;
    }
  }

  return {
    // Account data
    depositedcUSD: accountData ? formatUnits(accountData[0], 18) : "0",
    borrowedCELO: accountData ? formatEther(accountData[1]) : "0",
    maxBorrowCELO: accountData ? formatEther(accountData[2]) : "0",
    healthFactor: accountData ? accountData[3] : BigInt(0),
    // Pool data
    totalDeposited: poolData ? formatUnits(poolData[0], 18) : "0",
    totalBorrowed: poolData ? formatEther(poolData[1]) : "0",
    availableLiquidity: poolData ? formatEther(poolData[2]) : "0",
    // Balances
    cUSDBalance: cUSDBalance ? formatUnits(cUSDBalance.value, 18) : "0",
    celoBalance: celoBalance ? formatEther(celoBalance.value) : "0",
    // Actions
    deposit,
    withdraw,
    borrow,
    repay,
    lendingPoolAddress,
    cUSDAddress,
  };
}
