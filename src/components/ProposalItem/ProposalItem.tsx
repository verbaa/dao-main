import toast from 'react-hot-toast';
import { useProposalDetail } from '../../hooks/useProposalDetail';
import { useVoteOnProposal } from '../../hooks/useVoteOnProposal';

import styles from './ProposalItem.module.scss';

type ProposalItemProps = {
  id: string;
};

const ProposalItem = ({ id }: ProposalItemProps) => {
  const { proposal, isLoading } = useProposalDetail(id);
  const { vote, isSigning } = useVoteOnProposal();

  if (isLoading) return <div className={styles.loading}>Loading proposal #{id}...</div>;
  if (!proposal) return null;

  const handleVote = async (support: boolean) => {
    const toastId = toast.loading("Processing vote...");

    try {
      await vote({ id, support });
      toast.success("Vote cast successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to vote", { id: toastId });
    }
  };

  return (
    <div className={`${styles.card} ${proposal.executed ? styles.executed : ''}`}>
      <div className={styles.header}>
        <span className={styles.id}>#{proposal.id}</span>
        {proposal.executed && <span className={styles.badge}>Executed</span>}
        {proposal.hasVoted && <span className={styles.votedBadge}>You Voted</span>}
        {proposal.isVotingClosed && !proposal.executed && <span className={styles.closedBadge}>Voting Closed</span>}
      </div>

      <p className={styles.description}>{proposal.description}</p>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.label}>👍 For</span>
          <span className={styles.value}>{proposal.voteCountFor}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>👎 Against</span>
          <span className={styles.value}>{proposal.voteCountAgainst}</span>
        </div>
        {/*//TODO: make deadline later*/}
        {/*<div className={styles.statItem}>*/}
        {/*  <span className={styles.label}>⏰ Deadline</span>*/}
        {/*  <span className={styles.value}>*/}
        {/*    {new Date(proposal.deadline * 1000).toLocaleDateString()}*/}
        {/*  </span>*/}
        {/*</div>*/}
      </div>

      {!proposal.executed && !proposal.isVotingClosed && (
        <div className={styles.actions}>
          <button
            onClick={() => handleVote(true)}
            disabled={isSigning || proposal.hasVoted}
            className={`${styles.voteBtn} ${styles.yes}`}
          >
            Vote For
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isSigning || proposal.hasVoted}
            className={`${styles.voteBtn} ${styles.no}`}
          >
            Vote Against
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalItem;