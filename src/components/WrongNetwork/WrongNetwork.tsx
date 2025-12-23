import {hoodi} from "../../config/customNetworks";

import styles from "../WalletConnect/WalletConnect.module.scss";

type WrongNetworkProps = {
  chainName?: string;
  onSwitch: (chainId: number) => void;
  onDisconnect: () => void;
};

const WrongNetwork = ({chainName, onSwitch, onDisconnect}: WrongNetworkProps) => {
  return (
    <div className={styles.wrongNetwork}>
      <h3>Wrong Network</h3>
      <p>You are connected to <b>{chainName || 'Unknown Network'}</b></p>
      <p>Please switch to <b>{hoodi.name}</b></p>

      <div className={styles.actions}>
        <button
          onClick={() => onSwitch(hoodi.id as number)}
          className={styles.switch}
        >
          Switch to Hoodi
        </button>

        <button
          onClick={onDisconnect}
          className={styles.disconnect}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default WrongNetwork;