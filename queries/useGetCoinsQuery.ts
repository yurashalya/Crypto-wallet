import { useQuery } from "@tanstack/react-query";

type useGetCoinsQueryProps = {
  ids?: string;
};

export const useGetCoinsQuery = ({ ids }: useGetCoinsQueryProps) =>
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
