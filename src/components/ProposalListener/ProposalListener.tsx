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
        console.log("Event: Created", id);
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
    onLogs(logs) {
      logs.forEach((log: any) => {
        const pid = log.args?.proposalId?.toString();
        const support = log.args?.support;
        const type = support ? "For" : "Against";

        console.log(`🗳️ Event: Voted ${type} on #${pid}`);

        toast.success(`Vote "${type}" registered on Proposal #${pid}!`);

        emit('proposalVoted', { id: pid });
      });
    },
  });

  useWatchContractEvent({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    eventName: 'ProposalExecuted',
    poll: true,
    pollingInterval: 2000,
    onLogs(logs) {
      logs.forEach((log: any) => {
        const id = log.args?.id?.toString();
        toast.success(`⚡ Proposal #${id} EXECUTED successfully!`);
        emit('proposalExecuted', { id });
      });
    },
  });

  return null;
};

export default ProposalListener;