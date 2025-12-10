import { ReactNode } from 'react';
import WalletConnect from '../WalletConnect/WalletConnect';
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
import {AuthStatus} from "../../constants";

import styles from './DAPPLayout.module.scss';

interface Props {
  children: ReactNode;
}

const DAPPLayout = ({ children }: Props) => {
  const { isAuthenticated, authStatus, login, logout, isConnected } = useWeb3Auth();

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h1>Welcome</h1>
        <p>Please connect your wallet to continue.</p>
        <div className={styles.connectWrapper}>
          <WalletConnect />
        </div>
      </div>
    );
  }

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          🔐 Signing in... <br/> Please check your wallet.
        </div>
      </div>
    );
  }

  if (authStatus === AuthStatus.ERROR && !isAuthenticated) {
    return (
      <div className={styles.container}>
        <h3 className={styles.error}>Authentication Failed</h3>
        <p>You need to sign the message to verify ownership.</p>
        <div className={styles.actions}>
          <button onClick={login} className={styles.retryBtn}>
            Retry Authentication
          </button>
          <button onClick={logout} className={styles.disconnectBtn}>
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.walletWrapper}>
          <WalletConnect />
        </div>
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default DAPPLayout;