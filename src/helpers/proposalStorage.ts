import { useCallback } from 'react';
import useSWR from 'swr';

export const PROPOSALS_KEY = 'proposals';
export const VOTED_PROPOSALS_KEY = 'voted_proposals';

function readArrayFromStorage(key: string): string[] {
  if (typeof window === 'undefined' || !('localStorage' in window)) return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

const storageReaders: Record<string, () => string[]> = {
  [PROPOSALS_KEY]: () => readArrayFromStorage(PROPOSALS_KEY),
  [VOTED_PROPOSALS_KEY]: () => readArrayFromStorage(VOTED_PROPOSALS_KEY),
};

export function useProposals() {
  const { data: proposals, mutate } = useSWR<string[]>(PROPOSALS_KEY, storageReaders[PROPOSALS_KEY]);
  const { data: votedProposals, mutate: mutateVoted } = useSWR<string[]>(VOTED_PROPOSALS_KEY, storageReaders[VOTED_PROPOSALS_KEY]);

  const save = useCallback((proposalId: string, storageKey: string = PROPOSALS_KEY) => {
    const isVoted = storageKey === VOTED_PROPOSALS_KEY;
    const mutator = isVoted ? mutateVoted : mutate;
    const storageKeyToUse = isVoted ? VOTED_PROPOSALS_KEY : PROPOSALS_KEY;

    mutator(prev => {
      const base = Array.isArray(prev) ? prev : [];
      if (base.includes(proposalId)) return base;
      const next = [...base, proposalId];
      try {
        localStorage.setItem(storageKeyToUse, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    }, { revalidate: false });
  }, [mutate, mutateVoted]);

  return { proposals: proposals ?? [], votedProposals: votedProposals ?? [], save };
}