import { useQuery } from "@tanstack/react-query";
import { getTickers } from "@/app/api/tickers";

import { Ticker } from "@/types/crypto";

type useGetCoinTickersQueryProps = {
  name?: string;
  symbol?: string;
};

export const useGetCoinTickersQuery = ({
  name,
  symbol,
}: useGetCoinTickersQueryProps) => {
  return useQuery({
    queryKey: ["tickers", name, symbol],
    queryFn: async (): Promise<Ticker[]> => {
      if (!name || !symbol) {
        throw new Error("Name and symbol are required");
      }
      const tickers = await getTickers(name, symbol);
      return tickers;
    },
    enabled: !!name && !!symbol,
  });
};
