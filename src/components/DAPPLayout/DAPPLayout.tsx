import {ReactNode, useState} from 'react';
import WalletConnect from '../WalletConnect/WalletConnect';
import {useWeb3Auth} from '../../hooks/useWeb3Auth';
import {AuthStatus} from "../../constants";

import styles from './DAPPLayout.module.scss';

interface Props {
  children: ReactNode;
}

const DAPPLayout = ({children}: Props) => {
  const {isAuthenticated, authStatus, login, logout, isConnected} = useWeb3Auth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h1>System Access</h1>
        <p>Connect your neural interface (Wallet) to access the DAO Governance Module.</p>
        <div className={styles.connectWrapper}>
          <WalletConnect/>
        </div>
      </div>
    );
  }

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <span>Initializing Handshake...</span>
          <small style={{fontSize: '0.8em', color: 'var(--text-muted)'}}>Check your wallet for signature request</small>
        </div>
      </div>
    );
  }

  if (authStatus === AuthStatus.ERROR && !isAuthenticated) {
    return (
      <div className={styles.container}>
        <h3 className={styles.error}>Access Denied</h3>
        <p>Signature verification failed. Ownership not confirmed.</p>
        <div className={styles.actions}>
          <button onClick={login} className={styles.retryBtn}>
            Retry Access
          </button>
          <button onClick={logout} className={styles.disconnectBtn}>
            Abort Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>DAO</div>

        <button onClick={toggleDrawer} className={styles.menuTriggerBtn}>
          <span className={styles.btnText}>PROFILE_DATA</span>
          <span className={styles.btnIcon}>[ :: ]</span>
        </button>
      </header>

      <>
        <div
          className={`${styles.backdrop} ${isDrawerOpen ? styles.open : ''}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
          <div className={styles.drawerHeader}>
            <h3>USER_MODULE</h3>
            <button onClick={() => setIsDrawerOpen(false)} className={styles.closeBtn}>X</button>
          </div>

          <div className={styles.drawerContent}>
            <div className={styles.sectionTitle}>Identity</div>
            <div className={styles.walletWrapper}>
              <WalletConnect/>
            </div>

            <div className={styles.drawerFooter}>
              <button onClick={logout} className={styles.disconnectBtnFull}>
                TERMINATE SESSION
              </button>
            </div>
          </div>
        </div>
      </>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default DAPPLayout;