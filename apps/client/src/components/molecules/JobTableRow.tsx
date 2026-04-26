import type { Job } from '@mern/types';
import { StatusBadge } from '../atoms/StatusBadge';
import { Button } from '../atoms/Button';

interface JobTableRowProps {
  job: Job;
  onAssignReporter: (job: Job) => void;
  onAssignEditor: (job: Job) => void;
  onUpdateStatus: (job: Job) => void;
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
  onUpdateStatus
}) => {
  return (
    <tr className="table-row">
      <td>{job.caseName}</td>
      <td>{job.duration} min</td>
      <td>
        <div className="location-info">
          <span className={`location-type type-${job.locationType}`}>
            {job.locationType}
          </span>
          {job.locationName && <span className="location-name">{job.locationName}</span>}
        </div>
      </td>
      <td><StatusBadge status={job.status} /></td>
      <td>
        {job.reporter ? (
          <div className="user-info">
            <span className="user-name">{job.reporter.username}</span>
            <span className="user-detail">{job.reporter.location}</span>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => onAssignReporter(job)}>
            Assign Reporter
          </Button>
        )}
      </td>
      <td>
        {job.editor ? (
          <span className="user-name">{job.editor.username}</span>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAssignEditor(job)}
            disabled={job.status === 'NEW' || job.status === 'ASSIGNED'}
          >
            Assign Editor
          </Button>
        )}
      </td>
      <td>
        <div className="payment-info">
          <div className="payment-item">
            <span>Rep:</span> {formatIDR(job.payments?.reporterEarnings || 0)}
          </div>
          <div className="payment-item">
            <span>Ed:</span> {formatIDR(job.payments?.editorEarnings || 0)}
          </div>
        </div>
      </td>
      <td>
        <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(job)}>
          Update
        </Button>
      </td>
    </tr>
  );
};
