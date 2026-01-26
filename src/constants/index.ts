export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

export const MESSAGES = {
  LOADING: 'Authenticating...',
  SUCCESS: 'Authenticated',
  WAITING: 'Waiting for signature...',
  VERIFYING: 'Verifying signature...',
  REJECTED: 'Signature rejected or failed',
  FAILED: 'Failed to authenticate',
};

export const USER_REJECTED_CODE = 4001;

export const MIN_TOKENS_REQUIRED = 100;

export const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000';