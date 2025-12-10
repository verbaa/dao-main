import {useState, useEffect, useCallback} from 'react';
import {useAccount, useDisconnect, useSignMessage} from 'wagmi';
import toast from 'react-hot-toast';
import {SiweMessage} from 'siwe';
import {useAuth} from '../context/AuthContext';
import {getNonce, verifySignature} from '../api/auth';
import {AuthStatus, MESSAGES, USER_REJECTED_CODE} from "../constants";
import {IWeb3Error} from "../types/global";

export const useWeb3Auth = () => {
  const {address, isConnected, chainId, status} = useAccount();
  const {disconnect} = useDisconnect();
  const {signMessageAsync} = useSignMessage();
  const {isAuthenticated, setIsAuthenticated} = useAuth();

  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.IDLE);

  const login = useCallback(async () => {
    if (!address || !chainId || status !== 'connected') {
      return;
    }

    const toastId = toast.loading(MESSAGES.LOADING);

    try {
      setAuthStatus(AuthStatus.LOADING);

      const nonce = await getNonce(address);

      toast.loading(MESSAGES.WAITING, {id: toastId});

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      const messageToSign = message.prepareMessage();
      const signature = await signMessageAsync({message: messageToSign});

      toast.loading(MESSAGES.VERIFYING, {id: toastId});

      await verifySignature(address, signature);

      setIsAuthenticated(true);
      setAuthStatus(AuthStatus.IDLE);

      toast.success(MESSAGES.SUCCESS, {id: toastId});

    } catch (err) {
      const error = err as IWeb3Error;
      console.error("Auth failed:", error);
      setAuthStatus(AuthStatus.ERROR);

      if (error.code === USER_REJECTED_CODE || error.message?.includes('rejected')) {
        toast.error(MESSAGES.REJECTED, {id: toastId});
      } else {
        toast.error(MESSAGES.FAILED, {id: toastId});
      }
    }
  }, [address, chainId, status, signMessageAsync, setIsAuthenticated]);

  const logout = useCallback(() => {
    disconnect();
    setIsAuthenticated(false);
    setAuthStatus(AuthStatus.IDLE);
    toast('Wallet disconnected');
  }, [disconnect, setIsAuthenticated]);

  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      const timer = setTimeout(() => {
        setIsAuthenticated(false);
        setAuthStatus(AuthStatus.IDLE);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    if (status === 'connected' && !isAuthenticated && authStatus === AuthStatus.IDLE) {
      const timer = setTimeout(() => {
        login();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, isAuthenticated, authStatus, login]);

  return {
    isAuthenticated,
    authStatus,
    login,
    logout,
    isConnected
  };
};