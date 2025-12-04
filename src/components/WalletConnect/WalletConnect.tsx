import {useAppKit} from '@reown/appkit/react';
import {useAccount, useDisconnect, useBalance, useSwitchChain} from 'wagmi';
import {hoodi} from "../../config/customNetworks.ts";
import Blockies from 'react-blockies';

import styles from './WalletConnect.module.scss';

const WalletConnect = () => {
  const {open} = useAppKit();
  const {address, isConnected, chainId, chain} = useAccount();
  const {disconnect} = useDisconnect();
  const {switchChain} = useSwitchChain();

  const {data: balance} = useBalance({
    address: address,
  });

  if (typeof window === "undefined") {
    return null;
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className={styles.connectButton}
      >
        Connect Wallet
      </button>
    );
  }

  if (chainId !== hoodi.id) {
    return (
      <div className={styles.wrongNetwork}>
        <h3>⚠️ Wrong Network</h3>
        <p>You are connected to <b>{chain?.name || 'Unknown Network'}</b></p>
        <p>Please switch to <b>{hoodi.name}</b></p>

        <div className={styles.actions}>
          <button
            onClick={() => switchChain({chainId: hoodi.id as number})}
            className={styles.switch}
          >
            Switch to Hoodi
          </button>

          <button
            onClick={() => disconnect()}
            className={styles.disconnect}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Blockies seed={address?.toLowerCase() || ''} size={10} scale={4}/>
        </div>
        <div>
          <span className={styles.status}>● Connected</span>
          <span className={styles.networkName}>{chain?.name} (ID: {chainId})</span>
        </div>
      </div>

      <div className={styles.section}>
        <strong>Address:</strong>
        <div className={styles.addressBox}>
          {address}
        </div>
      </div>

      <div className={styles.section}>
        <strong>Balance:</strong>
        <div className={styles.balanceValue}>
          {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
        </div>
      </div>

      <button
        onClick={() => disconnect()}
        className={styles.disconnectButton}
      >
        Disconnect
      </button>
    </div>
  );
};

export default WalletConnect;