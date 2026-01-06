import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export interface UserIdentity {
  address: string | undefined;
  isConnected: boolean;
  status: "connected" | "disconnected" | "connecting" | "reconnecting";
  role?: 'student' | 'teacher' | 'hod' | 'library' | 'admin';
  studentId?: string;
}

export const useAuthService = () => {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const [userIdentity, setUserIdentity] = useState<UserIdentity>({
    address,
    isConnected,
    status: status ?? "disconnected",
  });

  const linkWalletToUser = useCallback(async (walletAddress: string) => {
    try {
      const response = await axios.post('/api/auth/link-wallet', { walletAddress });
      setUserIdentity(prev => ({
        ...prev,
        role: response.data.role,
        studentId: response.data.studentId,
      }));
    } catch (error) {
      console.error('Failed to link wallet:', error);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isConnected && address) {
      linkWalletToUser(address);
    }
  }, [address, isConnected, linkWalletToUser]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(async () => {
    await open({ view: 'Connect' });
  }, [open]);

  const logout = useCallback(async () => {
    await open({ view: "Account" });
  }, [open]);

  return {
    login,
    logout,
    userIdentity,
  };
};
