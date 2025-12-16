import DaoContractAbi from './abi/DaoContractAbi.json';
import TokenAbi from './abi/TokenAbi.json';
import { Address } from 'viem';

export enum CONTRACTS {
  DAO_CONTRACT,
  TOKEN_CONTRACT,
}

export const CONTRACTS_ADDRESSES: Record<CONTRACTS, Address> = {
  [CONTRACTS.DAO_CONTRACT]: import.meta.env.VITE_DAO_CONTRACT as Address,
  [CONTRACTS.TOKEN_CONTRACT]: import.meta.env.VITE_TOKEN_CONTRACT as Address,
}

export const CONTRACT_ABIS = {
  [CONTRACTS.DAO_CONTRACT]: DaoContractAbi,
  [CONTRACTS.TOKEN_CONTRACT]: TokenAbi,
}

export function getContractInfo(name: keyof typeof CONTRACTS_ADDRESSES) {
  return {
    address: CONTRACTS_ADDRESSES[name],
    abi: CONTRACT_ABIS[name],
  };
}