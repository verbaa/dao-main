import { useWatchContractEvent } from 'wagmi';
import toast from 'react-hot-toast';
import { CONTRACTS, getContractInfo } from "../../contracts";
import { emit } from "../../helpers/eventBus";

const ProposalListener = () => {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);

  useWatchContractEvent({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    eventName: 'ProposalCreated',
    poll: true,
    pollingInterval: 2000,
    onLogs(logs) {
      logs.forEach((log: any) => {
        const id = log.args?.id?.toString();
        if (id) {
          toast.success(`New Proposal #${id} created!`);
          emit('proposalCreated', { id });
        }
      });
    },
  });

  useWatchContractEvent({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    eventName: 'Voted',
    poll: true,
    pollingInterval: 2000,
    onLogs() {
      emit('proposalVoted', {});
    },
  });

  return null;
};

export default ProposalListener;