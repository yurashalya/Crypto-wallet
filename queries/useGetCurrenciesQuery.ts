import { useQuery } from "@tanstack/react-query";

export const useCurrenciesQuery = () =>
  useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await fetch("/api/listing").then((res) => res.json());
    },
  });
