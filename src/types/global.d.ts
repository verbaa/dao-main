
export {}; // ensure module scope

declare global {
  interface Window {
	ethereum?: any;
  }
}

export type BalanceType = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export interface IWeb3Error extends Error {
  code?: number;
}

export interface IAuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}