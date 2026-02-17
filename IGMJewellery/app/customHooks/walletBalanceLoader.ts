import { useEffect, useState } from "react";
import { WRAPPER_API } from "../../store/newApis/apiUrl.const";

export const useWalletBalance = (userId: string) => {
  const [walletBallance, setBalance] = useState(0);
  const [isWalletBalanceLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${WRAPPER_API}/users/${userId}`);

        if (!response.ok) {
          throw new Error("Could not fetch balance");
        }

        const data = await response.json();

        setBalance(data.walletBalance ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  return { balance: walletBallance, isLoading: isWalletBalanceLoading, error };
};
