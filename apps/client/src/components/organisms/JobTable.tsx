import type { Job } from '@mern/types';
import { JobTableRow } from '../molecules/JobTableRow';
import styles from './JobTable.module.css';

interface JobTableProps {
  jobs: Job[];
  isLoading: boolean;
  onAssignReporter: (job: Job) => void;
  onAssignEditor: (job: Job) => void;
  onUpdateStatus: (job: Job) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  isLoading,
  onAssignReporter,
  onAssignEditor,
  onUpdateStatus
}) => {
  if (isLoading) return <div className={styles.loading}>Loading jobs...</div>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Case Name</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Status</th>
            <th>Reporter</th>
            <th>Editor</th>
            <th>Payments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobTableRow
              key={job.id}
              job={job}
              onAssignReporter={onAssignReporter}
              onAssignEditor={onAssignEditor}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyMessage}>
                No jobs found. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
