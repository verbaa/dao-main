import { useEffect, useState } from 'react';

import styles from './ProposalTimer.module.scss';

type ProposalTimerProps = {
  deadline?: number;
  executed?: boolean;
};

const ProposalTimer = ({ deadline, executed }: ProposalTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!deadline){
      return;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deadline - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    const now = Math.floor(Date.now() / 1000);
    setTimeLeft(deadline - now > 0 ? deadline - now : 0);

    return () => clearInterval(interval);
  }, [deadline]);

  if (executed) {
    return (
      <span className={styles.timeLabel} style={{ color: 'var(--text-muted)' }}>
        CLOSED
      </span>
    );
  }

  if (timeLeft <= 0) {
    return (
      <span className={styles.timeLabel} style={{ color: 'var(--neon-red)' }}>
        VOTING ENDED
      </span>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <span className={styles.timeLabel} style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>
      {formattedTime}
    </span>
  );
};

export default ProposalTimer;