import { useState, useEffect } from 'react';
import type { Job } from '@mern/types';
import { JobTableRow } from './JobTableRow';
import { Pagination } from '../../../components/ui/Pagination';
import styles from './JobTable.module.css';

interface JobTableProps {
  jobs: Job[];
  isLoading: boolean;
  onAssignReporter: (job: Job) => void;
  onAssignEditor: (job: Job) => void;
  onCompleteJob: (job: Job) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  isLoading,
  onAssignReporter,
  onAssignEditor,
  onCompleteJob
}) => {
  // Read initial state from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('page')) || 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('limit')) || 10;
  });

  // Sync state with URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', currentPage.toString());
    url.searchParams.set('limit', pageSize.toString());
    window.history.replaceState({}, '', url.toString());
  }, [currentPage, pageSize]);

  if (isLoading) return <div className={styles.loading}>Loading jobs...</div>;

  const totalItems = jobs.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className={styles.wrapper}>
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
            {paginatedJobs.map((job) => (
              <JobTableRow
                key={job.id}
                job={job}
                onAssignReporter={onAssignReporter}
                onAssignEditor={onAssignEditor}
                onCompleteJob={onCompleteJob}
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

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};
