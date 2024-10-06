"use client";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther, erc20Abi } from "viem";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { abi as LendingBorrowingSystemABI } from "../lib/abis/LendingBorrowingSystem.json";

const CONTRACT_ADDRESS = "0x17578B4C4Ee77f2E4D30047f2ECdC1FA38382d33";

export default function LendingBorrowingSystem() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { data: poolBalance } = useBalance({
    address: CONTRACT_ADDRESS,
  });
  // Get cETH and lETH contract addresses
  const { data: cETHAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LendingBorrowingSystemABI,
    functionName: "cETH",
  });

  const { data: lETHAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LendingBorrowingSystemABI,
    functionName: "lETH",
  });

  // Read balances of cETH and lETH
  const { data: tokenBalances } = useReadContracts({
    contracts: [
      {
        address: cETHAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address || "0x"],
      },
      {
        address: lETHAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address || "0x"],
      },
    ],
  });

  const [cETHBalance, lETHBalance] = tokenBalances || [];

  const { writeContract, isPending: isWritePending } = useWriteContract();

  const { isLoading: isWaitingForTx, isSuccess: txSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}` | undefined,
    });

  const handleLend = () => {
    if (amount) {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: LendingBorrowingSystemABI,
          functionName: "lend",
          value: parseEther(amount),
        },
        {
          onSuccess: (hash) => setTxHash(hash),
        }
      );
    }
  };

  const handleBorrow = () => {
    if (amount) {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: LendingBorrowingSystemABI,
          functionName: "borrow",
          args: [parseEther(amount)],
        },
        {
          onSuccess: (hash) => setTxHash(hash),
        }
      );
    }
  };

  const handleRedeemCollateral = () => {
    if (amount) {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: LendingBorrowingSystemABI,
          functionName: "redeem",
          args: [parseEther(amount), true],
        },
        {
          onSuccess: (hash) => setTxHash(hash),
        }
      );
    }
  };

  const handleRedeemLiability = () => {
    if (amount) {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: LendingBorrowingSystemABI,
          functionName: "redeem",
          args: [parseEther(amount), false],
        },
        {
          onSuccess: (hash) => setTxHash(hash),
        }
      );
    }
  };

  useEffect(() => {
    if (txSuccess) {
      setAmount("");
    }
  }, [txSuccess]);

  // Helper function to format BigInt values
  const formatBigInt = (value: bigint | undefined) => {
    if (value === undefined) return "0";
    return formatEther(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Lending and Borrowing System
      </h1>

      {!isConnected ? (
        <div className="text-center">
          <WalletButton wallet="metamask" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                ETH: {ethBalance ? formatBigInt(ethBalance.value) : "0"} ETH
              </p>
              <p>cETH: {formatBigInt(cETHBalance?.result)} cETH</p>
              <p>lETH: {formatBigInt(lETHBalance?.result)} lETH</p>
              {txHash && (
                <p>
                  <a
                    href={`https://sepolia.lineascan.build/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Last Transaction
                  </a>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pool Balance: {formatBigInt(poolBalance?.value)} ETH</p>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mb-4"
                step="any"
              />
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleLend}
                  disabled={isWritePending || isWaitingForTx}
                >
                  {isWritePending || isWaitingForTx ? "Processing..." : "Lend"}
                </Button>
                <Button
                  onClick={handleBorrow}
                  disabled={isWritePending || isWaitingForTx}
                >
                  {isWritePending || isWaitingForTx
                    ? "Processing..."
                    : "Borrow"}
                </Button>
                <Button
                  onClick={handleRedeemCollateral}
                  disabled={isWritePending || isWaitingForTx}
                >
                  {isWritePending || isWaitingForTx
                    ? "Processing..."
                    : "Redeem Collateral"}
                </Button>
                <Button
                  onClick={handleRedeemLiability}
                  disabled={isWritePending || isWaitingForTx}
                >
                  {isWritePending || isWaitingForTx
                    ? "Processing..."
                    : "Redeem Liability"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {txSuccess && (
        <Alert className="mt-4">
          <AlertDescription>
            Transaction successful! Tx hash: {txHash}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
