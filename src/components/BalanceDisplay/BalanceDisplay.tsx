import {useAccount, useBalance} from 'wagmi';
import {Address} from 'viem';

import styles from './BalanceDisplay.module.scss';

type Props = {
  tokenAddress?: Address;
  label: string;
};

const BalanceDisplay = ({tokenAddress, label}: Props) => {
  const {address} = useAccount();

  const {data, isLoading, isError} = useBalance({
    address: address,
    token: tokenAddress,
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
    }
  });

  if (isLoading) return <div className={styles.balanceItem}>Loading {label}...</div>;
  if (isError) return <div className={styles.balanceItem}>Error fetching {label}</div>;

  return (
    <div className={styles.balanceItem}>
      <strong>{label}:</strong>
      <div className={styles.value}>
        {data
          ? `${Number(data.formatted).toFixed(4)} ${data.symbol}`
          : '0.0000'}
      </div>
    </div>
  );
};

export default BalanceDisplay;