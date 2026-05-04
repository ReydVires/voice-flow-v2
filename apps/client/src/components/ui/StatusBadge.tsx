import type { JobStatus } from '@mern/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: JobStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = styles[`status${status}` as keyof typeof styles];

  return (
    <span className={`${styles.statusBadge} ${statusClass}`}>
      {status}
    </span>
  );
};
