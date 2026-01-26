import {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import {useAccount, useBalance} from 'wagmi';
import {useProposalDetail} from '../../hooks/useProposalDetail';
import {useVoteOnProposal} from '../../hooks/useVoteOnProposal';
import {useExecuteProposal} from '../../hooks/useExecuteProposal';
import {on, off} from "../../helpers/eventBus";
import {CONTRACTS, CONTRACTS_ADDRESSES} from "../../contracts";
import {MIN_TOKENS_REQUIRED} from "../../constants";

import styles from './ProposalItem.module.scss';

type ProposalItemProps = {
  id: string;
};

const ProposalItem = ({id}: ProposalItemProps) => {
  const {address} = useAccount();
  const {proposal, isLoading, refetch} = useProposalDetail(id);
  const {vote, isSigning} = useVoteOnProposal();
  const {execute, isExecuting} = useExecuteProposal();

  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000);

  const {data: tokenData, isLoading: isBalanceLoading} = useBalance({
    address: address,
    token: CONTRACTS_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as `0x${string}`,
  });

  const userBalance = tokenData ? Number(tokenData.formatted) : 0;
  const hasEnoughTokens = userBalance >= MIN_TOKENS_REQUIRED;

  useEffect(() => {
    const handleUpdate = () => {
      setTimeout(() => {
        refetch();
      }, 7000);
    };

    on('proposalVoted', handleUpdate);
    on('proposalExecuted', handleUpdate);

    return () => {
      off('proposalVoted', handleUpdate);
      off('proposalExecuted', handleUpdate);
    };
  }, [id, refetch]);


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

  const timeLeft = Math.max(0, proposal.deadline - currentTime);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleVote = async (support: boolean) => {

    if (!hasEnoughTokens) {
      toast.error(`Insufficient funds. You need ${MIN_TOKENS_REQUIRED} SVER to vote.`);
      return;
    }

    const toastId = toast.loading("Transaction sent. Waiting for block...");

    try {
      await vote({ id, support });

      toast.success("Vote cast successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Vote rejected", { id: toastId });
    }
  };

  const handleExecute = async () => {
    const toastId = toast.loading("Executing proposal...");
    try {
      await execute(id);
      toast.success("Execution transaction sent! Waiting...", {
        id: toastId,
        duration: 8000
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Execution failed or rejected", {id: toastId});
    }
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
          <span className={styles.label}>For</span>
          <span className={styles.value}>{proposal.voteCountFor}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>Against</span>
          <span className={styles.value}>{proposal.voteCountAgainst}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>
            {isVotingClosed ? "Ended At" : "Time Left"}
          </span>
          <span
            className={styles.value}
            style={{
              color: isVotingClosed ? 'var(--text-muted)' : 'var(--neon-green)',
              textShadow: isVotingClosed ? 'none' : '0 0 5px var(--neon-green)'
            }}
          >
            {isVotingClosed
              ? new Date(Number(proposal.deadline) * 1000).toLocaleTimeString()
              : `${timerDisplay}`
            }
          </span>
        </div>
      </div>

      {!hasEnoughTokens && !isVotingClosed && !proposal.executed && (
        <div className={styles.warningBox}>
          ACCESS DENIED: Insufficient Voting Power <br/>
          <small>Required: {MIN_TOKENS_REQUIRED} SVER | You have: {userBalance.toFixed(2)} SVER</small>
        </div>
      )}

      <div className={styles.actions}>
        {!isVotingClosed && !proposal.executed && (
          <>
            <button
              onClick={() => handleVote(true)}
              disabled={isSigning || proposal.hasVoted || !hasEnoughTokens || isBalanceLoading}
              className={`${styles.voteBtn} ${styles.yes}`}
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={isSigning || proposal.hasVoted || !hasEnoughTokens || isBalanceLoading}
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
            {isExecuting ? 'PROCESSING...' : 'EXECUTE PROPOSAL'}
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