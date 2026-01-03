import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon, arbitrum } from "@reown/appkit/networks";

// 1. Get projectId from https://cloud.reown.com
export const projectId =
  process.env.VITE_REOWN_PROJECT_ID || "b56e18d47c72ab683b6a6c388277cc2e"; // Default or Env

// 2. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, arbitrum],
  projectId,
});

export const networks = [mainnet, polygon, arbitrum];
