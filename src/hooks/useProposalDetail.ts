import {useMemo, useEffect} from "react";
import {useReadContract} from "wagmi";
import {CONTRACTS, getContractInfo} from "../contracts";
import {on, off} from '../helpers/eventBus';
import {useProposals} from '../helpers/proposalStorage';

export type ProposalDetail = {
  id: string;
  description: string;
  executed: boolean;
  voteCountFor: string;       // рядок з bigint
  voteCountAgainst: string;   // рядок з bigint
  deadline: number;           // unix seconds
  creator?: string;           // не обіцяно ABI getProposal, лишаємо опціонально
  isVotingClosed: boolean;    // чи завершено голосування
  hasVoted?: boolean; 		  // чи голосував поточний користувач (можна додати пізніше)
};

function normalizeProposal(data: any, votedProposals: string[] = []): ProposalDetail | null {
  if (!data) return null;

  const now = Date.now() / 1000;

  if (Array.isArray(data)) {
    const [pid, description, executed, forVotes, againstVotes, deadline] = data;
    const idStr = (pid as bigint).toString();
    return {
      id: idStr,
      description: description as string,
      executed: executed as boolean,
      voteCountFor: (forVotes as bigint).toString(),
      voteCountAgainst: (againstVotes as bigint).toString(),
      deadline: Number(deadline as bigint),
      isVotingClosed: Number(deadline) < now,
      hasVoted: votedProposals.includes(idStr),
    };
  }

  // Повернення як object (деякі контракти/генератори ABI)
  if (typeof data === "object" && "id" in data) {
    const obj = data as Record<string, unknown>;
    const idStr = (obj.id as bigint).toString();
    return {
      id: idStr,
      description: obj.description as string,
      executed: obj.executed as boolean,
      voteCountFor: (obj.voteCountFor as bigint).toString(),
      voteCountAgainst: (obj.voteCountAgainst as bigint).toString(),
      deadline: Number(obj.deadline as bigint),
      isVotingClosed: Number(obj.deadline) < now,
      hasVoted: votedProposals.includes(idStr),
    };
  }

  return null;
}

export function useProposalDetail(id: number | string | undefined) {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);
  const enabled = id !== undefined && id !== null;

  const {data, isPending, isError, refetch} = useReadContract({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    functionName: "proposals",
    args: enabled ? [BigInt(id as any)] : undefined,
    query: {
      enabled,
      refetchOnWindowFocus: false,
      staleTime: 15_000,
    },
  });

  const {votedProposals} = useProposals();

  const proposal = useMemo<ProposalDetail | null>(() => {
    const normalized = normalizeProposal(data, votedProposals);
    if (normalized) return normalized;

    return null;
  }, [data, id, enabled, votedProposals]);

  useEffect(() => {
    if (!enabled) return;
    const handler = (payload: any) => {
      if (payload?.id === String(id)) {
        refetch();
      }
    };
    on('proposalVoted', handler);
    return () => off('proposalVoted', handler);
  }, [id, enabled, refetch, votedProposals]);

  return {
    proposal,
    isLoading: enabled && isPending,
    isError,
    refetch,
  };
}