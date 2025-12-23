import { useAccount, useBalance } from 'wagmi';
import { Address } from 'viem';
import { formatTokenAmount } from '../../helpers/formatters';

import styles from './BalanceDisplay.module.scss';

type Props = {
  tokenAddress?: Address;
  label: string;
};

const BalanceDisplay = ({ tokenAddress, label }: Props) => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useBalance({
    address: address,
    token: tokenAddress,
  });

  if (isLoading) return <div className={styles.loading}>[ SCANNING... ]</div>;
  if (isError) return <div className={styles.error}>ERR: DATA_LOSS</div>;

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}:</span>

      <div className={styles.valueGroup}>
        <span className={styles.amount}>
          {data ? formatTokenAmount(data.formatted) : '0.00'}
        </span>
        <span className={styles.symbol}>
          {data?.symbol || ''}
        </span>
      </div>
    </div>
  );
};

export default BalanceDisplay;