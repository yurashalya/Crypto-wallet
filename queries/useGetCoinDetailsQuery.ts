import { useQuery } from "@tanstack/react-query";

type useGetCoinDetailsQueryProps = {
  id: string;
};

export const useGetCoinDetailsQuery = ({ id }: useGetCoinDetailsQueryProps) =>
  useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      return info[+id];
    },

    enabled: !!id,
  });
