import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon, arbitrum } from "@reown/appkit/networks";
import { wagmiAdapter, projectId } from "./wagmiConfig";

// 1. Get projectId from https://cloud.reown.com
// const projectId = 'YOUR_PROJECT_ID' // Moved to wagmiConfig

// 2. Create a metadata object
const metadata = {
  name: "EduNexus ERP",
  description: "Indian College ERP & Portal",
  url: "https://edunexus.example.com",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// 3. Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon, arbitrum],
  metadata,
  projectId,
  features: {
    email: true,
    socials: ["google", "x", "github", "discord", "apple"],
    emailShowWallets: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#06b6d4",
    "--w3m-border-radius-master": "1px",
  },
});

export { projectId, wagmiAdapter };
