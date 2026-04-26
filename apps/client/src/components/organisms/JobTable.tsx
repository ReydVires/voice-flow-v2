import type { Job } from '@mern/types';
import { JobTableRow } from '../molecules/JobTableRow';

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
  if (isLoading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="table-container">
      <table>
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
              <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                No jobs found. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
