import type { JobStatus } from '@mern/types';

interface StatusBadgeProps {
  status: JobStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = `status-${status.toLowerCase()}`;

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
};
