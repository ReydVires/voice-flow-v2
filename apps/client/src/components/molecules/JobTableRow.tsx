import type { Job } from '@mern/types';
import { StatusBadge } from '../atoms/StatusBadge';
import { Button } from '../atoms/Button';
import styles from './JobTableRow.module.css';

interface JobTableRowProps {
  job: Job;
  onAssignReporter: (job: Job) => void;
  onAssignEditor: (job: Job) => void;
  onCompleteJob: (job: Job) => void;
}

export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const JobTableRow: React.FC<JobTableRowProps> = ({
  job,
  onAssignReporter,
  onAssignEditor,
  onCompleteJob
}) => {
  const typeClass = job.locationType === 'physical' ? styles.typePhysical : styles.typeRemote;

  return (
    <tr className={styles.tableRow}>
      <td>{job.caseName}</td>
      <td>{job.duration} min</td>
      <td>
        <div className={styles.locationInfo}>
          <span className={`${styles.locationType} ${typeClass}`}>
            {job.locationType}
          </span>
          {job.locationName && <span className={styles.locationName}>{job.locationName}</span>}
        </div>
      </td>
      <td><StatusBadge status={job.status} /></td>
      <td>
        {job.reporter ? (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{job.reporter.username}</span>
            <span className={styles.userDetail}>{job.reporter.location}</span>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => onAssignReporter(job)}>
            Assign Reporter
          </Button>
        )}
      </td>
      <td>
        {job.editor ? (
          <span className={styles.userName}>{job.editor.username}</span>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAssignEditor(job)}
            disabled={job.status === 'NEW'}
          >
            Assign Editor
          </Button>
        )}
      </td>
      <td>
        <div className={styles.paymentInfo}>
          <div className={styles.paymentItem}>
            <span>Rep:</span> {formatIDR(job.payments?.reporterEarnings || 0)}
          </div>
          <div className={styles.paymentItem}>
            <span>Ed:</span> {formatIDR(job.payments?.editorEarnings || 0)}
          </div>
        </div>
      </td>
      <td>
        {job.status === 'REVIEWED' && (
          <Button size="sm" variant="ghost" onClick={() => onCompleteJob(job)}>
            Complete Job
          </Button>
        )}

      </td>
    </tr>
  );
};
