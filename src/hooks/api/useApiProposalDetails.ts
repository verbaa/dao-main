import useSWR from "swr";
import type { ProposalDetailsApi } from "../../api/types";
import { fetcher } from "../../api/http";
import { endpoints } from "../../api/endpoints";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
};

export function useApiProposalDetails(id: number | string | null | undefined) {
  const key = id ? endpoints.proposal(id) : null;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<ProposalDetailsApi>(key, fetcher, swrConfig);

  return {
    proposal: data ?? null,
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}