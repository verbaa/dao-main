import {useEffect, useMemo} from 'react';
import {useReadContract, useReadContracts} from 'wagmi';
import {Abi} from 'viem';
import {CONTRACTS, getContractInfo} from "../../contracts";
import {on, off} from "../../helpers/eventBus";
import ProposalItem from "../ProposalItem";

import styles from './ProposalList.module.scss';

const ProposalList = () => {
  const daoContract = getContractInfo(CONTRACTS.DAO_CONTRACT);
  const contractAbi = daoContract.abi as Abi;
  const contractAddress = daoContract.address;

  const {data: countData, refetch: refetchCount} = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'proposalCount',
  });

  const proposalCount = countData ? Number(countData) : 0;

  const contractsConfig = useMemo(() => {
    if (proposalCount === 0) return [];
    return Array.from({length: proposalCount}, (_, i) => ({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'getProposal',
      args: [BigInt(i + 1)],
    }));
  }, [proposalCount, contractAddress, contractAbi]);

  const {data: proposalsRaw, isLoading, refetch: refetchProposals} = useReadContracts({
    contracts: contractsConfig,
  });

  const proposalIds = useMemo(() => {
    if (!proposalsRaw) return [];

    return proposalsRaw
      .map((item) => {
        if (item.status === 'success' && item.result) {
          const res = item.result as any;
          return Number(res.id || res[0]);
        }
        return null;
      })
      .filter((id): id is number => id !== null)
      .sort((a, b) => b - a);
  }, [proposalsRaw]);

  useEffect(() => {
    const handleUpdate = async () => {
      await new Promise(r => setTimeout(r, 3000));
      await refetchCount();
      refetchProposals();
    };

    on('proposalCreated', handleUpdate);
    on('proposalVoted', handleUpdate);

    return () => {
      off('proposalCreated', handleUpdate);
      off('proposalVoted', handleUpdate);
    };
  }, [refetchCount, refetchProposals]);

  if (isLoading) return <div className={styles.loading}>Loading list...</div>;

  return (
    <div className={styles.list}>
      <h3>Active Proposals ({proposalCount})</h3>

      {proposalIds.length === 0 ? (
        <div className={styles.empty}>No proposals found yet.</div>
      ) : (
        proposalIds.map((id) => (
          <ProposalItem key={id} id={id.toString()}/>
        ))
      )}
    </div>
  );
};

export default ProposalList;