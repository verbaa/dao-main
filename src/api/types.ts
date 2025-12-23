export type ProposalApi = {
  id: number;
  description: string;
  creator: string;
  executed: boolean;
  votesFor: number;
  votesAgainst: number;
  status: string;
  deadline?: number;
};

export type VoteApi = {
  voter: string;
  support: boolean;
  timestamp?: string;
};

export type ProposalDetailsApi = ProposalApi & {
  votes?: VoteApi[];
};