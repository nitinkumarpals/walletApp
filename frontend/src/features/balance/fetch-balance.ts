import { walletApi } from "@/lib/api/client";

/** Client-side balance fetch used by the add-money screen. */
export const fetchBalance = async () => {
  try {
    return await walletApi.balance();
  } catch (error) {
    console.log(error);
  }
};
