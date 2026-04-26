import type { JobStatus } from '@mern/types';
import { Button } from '../atoms/Button';

interface StatusModalProps {
  currentStatus: JobStatus;
  onSelect: (status: JobStatus) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  currentStatus,
  onSelect,
  onClose,
  isLoading
}) => {
  const statuses: JobStatus[] = ['NEW', 'ASSIGNED', 'TRANSCRIBED', 'REVIEWED', 'COMPLETED'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>Update Job Status</h2>
        <div className="status-grid">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={currentStatus === status ? 'primary' : 'secondary'}
              onClick={() => onSelect(status)}
              isLoading={isLoading && currentStatus === status}
              disabled={isLoading}
            >
              {status}
            </Button>
          ))}
        </div>
        <Button variant="ghost" onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
