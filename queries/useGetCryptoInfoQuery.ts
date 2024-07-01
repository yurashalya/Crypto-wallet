import { useQuery } from "@tanstack/react-query";

type useCryptoInfoQueryProps = {
  ids?: string;
};

export const useCryptoInfoQuery = ({ ids }: useCryptoInfoQueryProps) =>
  useQuery({
    queryKey: ["info", ids],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${ids}`).then((res) =>
        res.json()
      );
      return info;
    },

    enabled: !!ids,
  });
