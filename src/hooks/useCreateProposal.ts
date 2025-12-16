import { CONTRACTS, getContractInfo } from "../contracts";
import { useChainId, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { savePendingTx } from "../helpers/txStorage.ts";
import { useRef } from "react";

const TOAST_MESSAGE = {
  LOADING: "Sign the transaction in your wallet…",
  SUCCESS: "Transaction sent! Waiting for confirmation...",
  ERROR: "Failed to submit proposal",
};

const functionName = "createProposal";

export function useCreateProposal() {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);
  const chainId = useChainId();

  const toastIdRef = useRef<string | undefined>(undefined);

  const {
    writeContractAsync,
    error: writeError,
    isPending: isSigning
  } = useWriteContract();

  async function handleCreateProposal(args: any[]): Promise<string | null> {
    try {

      toastIdRef.current = toast.loading(TOAST_MESSAGE.LOADING);

      const hash = await writeContractAsync({
        abi: contractInfo.abi,
        address: contractInfo.address as `0x${string}`,
        functionName,
        args,
      });

      if (hash) {
        savePendingTx({
          hash: hash,
          chainId,
          contract: contractInfo.address as string,
          tag: functionName,
          timestamp: Date.now(),
        });

        toast.success(TOAST_MESSAGE.SUCCESS, {
          id: toastIdRef.current,
          duration: 5000
        });

        return hash;
      }
      return null;

    } catch (e: any) {
      console.error(e);
      const errorMessage = e?.shortMessage || e?.message || TOAST_MESSAGE.ERROR;

      toast.error(errorMessage, {
        id: toastIdRef.current
      });

      return null;
    }
  }

  return {
    handleCreateProposal,
    isSigning,
    error: writeError || null,
  };
}