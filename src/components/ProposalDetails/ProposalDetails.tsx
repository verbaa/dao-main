import {useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {useApiProposalDetails} from '../../hooks/api/useApiProposalDetails';
import {on, off} from "../../helpers/eventBus";
import ProposalItem from '../ProposalItem';
import {shortenAddress} from "../../helpers/shortenAddress.ts";

import styles from './ProposalDetails.module.scss';

const ProposalDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const {proposal, isLoading, isError, error, mutate} = useApiProposalDetails(id);

  useEffect(() => {
    const handleUpdate = async () => {
      await new Promise(r => setTimeout(r, 7000));
      mutate();
    };

    on('proposalVoted', handleUpdate);
    on('proposalExecuted', handleUpdate);

    return () => {
      off('proposalVoted', handleUpdate);
      off('proposalExecuted', handleUpdate);
    };
  }, [mutate]);

  if (isLoading) return <div className={styles.loading}>Loading details...</div>;
  if (isError || !proposal) return (
    <div className={styles.errorContainer}>
      <p>Error: {String(error) || 'Proposal not found'}</p>
      <button onClick={() => navigate('/')} className={styles.backBtn}>Back to List</button>
    </div>
  );

  const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst);
  const chartData = [
    {name: 'For', value: Number(proposal.votesFor)},
    {name: 'Against', value: Number(proposal.votesAgainst)},
  ];

  const COLORS = ['#0aff0a', '#ff003c'];

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>&larr; Back to Proposals</button>

      <div className={styles.grid}>
        <div className={styles.chartSection}>
          <h2>Voting Results</h2>

          {totalVotes === 0 ? (
            <div className={styles.noVotes}>
              <p>No votes cast yet.</p>
              <p>Be the first to vote!</p>
            </div>
          ) : (
            <div style={{width: '100%', height: 300}}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{backgroundColor: '#050510', borderColor: '#00f3ff', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={styles.metaInfo}>
            <p><strong>Creator:</strong> <span className={styles.address}>{shortenAddress(proposal.creator)}</span></p>
            <p><strong>Status:</strong> <span className={styles.statusHighlight}>{proposal.status}</span></p>
          </div>
        </div>

        <div className={styles.actionSection}>
          <h3>Cast your Vote</h3>

          {id && <ProposalItem id={id}/>}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;