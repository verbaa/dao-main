import {useAppKit} from '@reown/appkit/react';
import {useAccount, useDisconnect, useSwitchChain} from 'wagmi';
import Blockies from 'react-blockies';
import WrongNetwork from "../WrongNetwork";
import BalanceDisplay from "../BalanceDisplay";
import {CONTRACTS, CONTRACTS_ADDRESSES} from "../../contracts";
import {hoodi} from "../../config/customNetworks";

import styles from './WalletConnect.module.scss';

const WalletConnect = () => {
  const {open} = useAppKit();
  const {address, isConnected, chainId, chain} = useAccount();
  const {disconnect} = useDisconnect();
  const {switchChain} = useSwitchChain();

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
      <WrongNetwork
        chainName={chain?.name}
        onSwitch={(id) => switchChain({chainId: id})}
        onDisconnect={() => disconnect()}
      />
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Blockies seed={address?.toLowerCase() || ''} size={10} scale={4}/>
        </div>
        <div>
          <span className={styles.status}>Connected</span>
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
        <BalanceDisplay label="Native Balance"/>

        <BalanceDisplay
          label="Hoodi Token"
          tokenAddress={CONTRACTS_ADDRESSES[CONTRACTS.TOKEN_CONTRACT]}
        />
      </div>
    </div>
  );
};

export default WalletConnect;