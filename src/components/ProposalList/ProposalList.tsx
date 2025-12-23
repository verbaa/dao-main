import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useApiProposals} from '../../hooks/api/useApiProposals';
import {on, off} from "../../helpers/eventBus";
import ProposalTimer from '../ProposalTimer/ProposalTimer';
import {shortenAddress} from "../../helpers/shortenAddress.ts";

import styles from './ProposalList.module.scss';

const ProposalList = () => {
  const {proposals, isLoading, isError, error, mutate} = useApiProposals();

  useEffect(() => {
    const handleUpdate = async () => {

      mutate();

      setTimeout(() => mutate(), 2000);

      setTimeout(() => mutate(), 5000);
    };

    on('proposalCreated', handleUpdate);
    on('proposalVoted', handleUpdate);
    on('proposalExecuted', handleUpdate);

    return () => {
      off('proposalCreated', handleUpdate);
      off('proposalVoted', handleUpdate);
      off('proposalExecuted', handleUpdate);
    };
  }, [mutate]);

  if (isLoading) return <div className={styles.loading}>Loading proposals...</div>;
  if (isError) return <div className={styles.error}>Error: {String(error)}</div>;

  const sortedProposals = [...proposals].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className={styles.list}>
      <h3 className={styles.pageTitle}>Active Proposals</h3>

      {sortedProposals.length === 0 ? (
        <div className={styles.empty}>No proposals found.</div>
      ) : (
        sortedProposals.map((prop) => {
          const totalVotes = prop.votesFor + prop.votesAgainst;
          const percentFor = totalVotes === 0 ? 0 : (prop.votesFor / totalVotes) * 100;

          return (
            <div key={prop.id} className={styles.cardPreview}>
              <div className={styles.header}>
                <div className={styles.idGroup}>
                  <span className={styles.id}>#{prop.id}</span>
                  <span className={`${styles.badge} ${prop.executed ? styles.executed : styles.active}`}>
                    {prop.status}
                  </span>
                </div>

                <ProposalTimer deadline={prop.deadline} executed={prop.executed}/>
              </div>

              <p className={styles.description}>{prop.description}</p>

              <div className={styles.metaInfo}>
                <small>By: <span className={styles.address}>{shortenAddress(prop.creator)}</span></small>

                <small>{prop.deadline ? new Date(prop.deadline * 1000).toLocaleTimeString() : ''}</small>
              </div>

              <div className={styles.votingBarContainer}>
                <div className={styles.votingLabels}>
                  <span className={styles.voteFor}>For {prop.votesFor}</span>
                  <span className={styles.voteAgainst}>Against {prop.votesAgainst}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{width: `${percentFor}%`}}
                  ></div>
                </div>
              </div>

              <div className={styles.footer}>
                <Link to={`/proposals/${prop.id}`} className={styles.detailsBtn}>
                  View Details &rarr;
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProposalList;