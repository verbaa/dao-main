import {useChainId, useWriteContract} from 'wagmi';
import { CONTRACTS, getContractInfo } from '../contracts';
import {savePendingTx} from "../helpers/txStorage.ts";
import toast from "react-hot-toast";
import {useRef} from "react";

export function useVoteOnProposal() {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);

  const { error: writeError, isPending: isSigning, writeContractAsync } = useWriteContract();

  const chainId = useChainId();
  const toastIdRef = useRef<string>("vote-proposal");
  const action = 'vote';

  async function vote({ id, support }: { id: string; support: boolean }) {
    try {
      toast.loading("Sign the transaction in your wallet…", { id: toastIdRef.current });

      const txHash = await writeContractAsync({
        address: contractInfo.address as `0x${string}`,
        abi: contractInfo.abi,
        functionName: action,
        args: [BigInt(id), support],
      });

      if (txHash) {
        savePendingTx({
          hash: txHash,
          chainId,
          contract: contractInfo.address as string,
          tag: action,
          timestamp: Date.now(),
        });

        toast.dismiss(toastIdRef.current);
        toast.success("Transaction sent!", { id: toastIdRef.current });
      }
    } catch (error: any) {
      console.error(error);

      toast.error(error?.shortMessage || "Failed to vote", {
        id: toastIdRef.current,
      });
    }
  }

  return {
    vote,
    isSigning,
    error: writeError || null,
  };
}