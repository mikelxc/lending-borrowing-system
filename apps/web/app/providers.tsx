"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { lineaSepolia } from "wagmi/chains";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [lineaSepolia],
  ssr: true,
  transports: {
    [lineaSepolia.id]: http(
      `https://linea-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
    ),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
