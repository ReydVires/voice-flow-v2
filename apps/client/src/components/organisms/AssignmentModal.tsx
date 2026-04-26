import type { User } from '@mern/types';
import { Button } from '../atoms/Button';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>{title}</h2>
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-selection-item">
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-detail">{user.email} {user.location ? `• ${user.location}` : ''}</span>
              </div>
              <Button size="sm" onClick={() => onSelect(user.id)} isLoading={isLoading}>
                Assign
              </Button>
            </div>
          ))}
          {users.length === 0 && <p className="loading">No available users found.</p>}
        </div>
        <Button variant="ghost" onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
