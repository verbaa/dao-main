import {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import {useProposalDetail} from '../../hooks/useProposalDetail';
import {useVoteOnProposal} from '../../hooks/useVoteOnProposal';
import {useExecuteProposal} from '../../hooks/useExecuteProposal';

import styles from './ProposalItem.module.scss';

type ProposalItemProps = {
  id: string;
};

const ProposalItem = ({id}: ProposalItemProps) => {
  const {proposal, isLoading} = useProposalDetail(id);
  const {vote, isSigning} = useVoteOnProposal();
  const {execute, isExecuting} = useExecuteProposal();

  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <div className={styles.loading}>Loading proposal #{id}...</div>;
  if (!proposal) return null;

  const isVotingClosed = currentTime >= proposal.deadline;
  const isPassing = proposal.voteCountFor > proposal.voteCountAgainst;
  const canExecute = isVotingClosed && isPassing && !proposal.executed;
  const deadlineDate = new Date(Number(proposal.deadline) * 1000).toLocaleString();

  const handleVote = async (support: boolean) => {
    const toastId = toast.loading("Processing vote...");
    try {
      await vote({id, support});
      toast.loading("Transaction sent. Waiting for block...", {id: toastId});
    } catch (error) {
      console.error(error);
      toast.error("Failed to vote", {id: toastId});
    }
  };

  const handleExecute = () => {
    execute(id);
  };

  return (
    <div className={`${styles.card} ${proposal.executed ? styles.executed : ''}`}>
      <div className={styles.header}>
        <span className={styles.id}>#{proposal.id}</span>

        {proposal.executed ? (
          <span className={`${styles.badge} ${styles.badgeExecuted}`}>Executed</span>
        ) : isVotingClosed ? (
          <span className={`${styles.badge} ${styles.badgeClosed}`}>Voting Ended</span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
        )}
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
        <div className={styles.statItem}>
          <span className={styles.label}>⏰ Deadline</span>
          <span className={styles.value} style={{fontSize: '12px'}}>
            {deadlineDate}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        {!isVotingClosed && !proposal.executed && (
          <>
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
          </>
        )}

        {canExecute && (
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={styles.executeBtn}
          >
            {isExecuting ? 'Executing...' : 'Execute Proposal'}
          </button>
        )}

        {isVotingClosed && !isPassing && !proposal.executed && (
          <div className={styles.failureMessage}>
            Proposal failed (For &le; Against)
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalItem;