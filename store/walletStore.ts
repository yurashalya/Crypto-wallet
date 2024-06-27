import { create } from "zustand";
import { zustandStorage } from "@/store/mmkv-store";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: Date;
}

export interface WalletState {
  transactions: Array<Transaction>;
  runTransaction: (transaction: Transaction) => void;
  wallet: () => number;
  clearTransactions: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      wallet: () =>
        get().transactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        ),
      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: "wallet",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
