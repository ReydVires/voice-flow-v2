import type { JobStatus } from '@mern/types';
import { Button } from '../atoms/Button';
import styles from './Modal.module.css';
import utils from '../../styles/utils.module.css';

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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${utils.card} ${utils.glass}`} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Update Job Status</h2>
        <div className={styles.statusGrid}>
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
        <Button variant="ghost" onClick={onClose} className={styles.modalFooterButton}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
