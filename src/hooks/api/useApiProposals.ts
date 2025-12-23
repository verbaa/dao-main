import useSWR from "swr";
import { fetcher } from "../../api/http";
import { endpoints } from "../../api/endpoints";
import type { ProposalApi } from "../../api/types";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
};

export function useApiProposals() {
  const { data, error, isLoading, mutate } = useSWR<ProposalApi[]>(
    endpoints.proposals,
    fetcher,
    swrConfig
  );

  return {
    proposals: data || [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}