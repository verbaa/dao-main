import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import toast from 'react-hot-toast';
import { CONTRACTS, getContractInfo } from "../contracts";

export const useExecuteProposal = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const daoContract = getContractInfo(CONTRACTS.DAO_CONTRACT);

  const execute = async (id: string) => {
    setIsExecuting(true);
    const toastId = toast.loading('Initiating execution...');

    try {
      const tx = await writeContractAsync({
        address: daoContract.address,
        abi: daoContract.abi,
        functionName: 'executeProposal',
        args: [BigInt(id)],
      });

      console.log('Execution Transaction sent:', tx);
      toast.success('Transaction sent! Waiting for confirmation...', { id: toastId });
    } catch (error: any) {
      console.error('Execute Error:', error);

      const errorMessage = error.message.includes("Voting is not over yet")
        ? "Voting is not over yet!"
        : error.message.includes("Not enough votes")
          ? "Quorum not reached (For <= Against)"
          : "Failed to execute proposal";

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsExecuting(false);
    }
  };

  return { execute, isExecuting };
};