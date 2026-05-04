import type { User } from '@mern/types';
import { Button } from '../../../components/ui/Button';
import styles from './Modal.module.css';
import utils from '../../../styles/utils.module.css';

interface AssignmentModalProps {
  title: string;
  users: User[];
  onSelect: (userId: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  title,
  users,
  onSelect,
  onClose,
  isLoading
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${utils.card} ${utils.glass}`} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.userList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userSelectionItem}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.username}</span>
                <span className={styles.userDetail}>{user.email} {user.location ? `• ${user.location}` : ''}</span>
              </div>
              <Button size="sm" onClick={() => onSelect(user.id)} isLoading={isLoading}>
                Assign
              </Button>
            </div>
          ))}
          {users.length === 0 && <p className={utils.loading}>No available users found.</p>}
        </div>
        <Button variant="ghost" onClick={onClose} className={styles.modalFooterButton}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
