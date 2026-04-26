import { useState } from 'react';
import type { Job, JobStatus } from '@mern/types';
import { useJobs, useCreateJob, useUpdateJobStatus, useAssignReporter, useAssignEditor, useReporters, useEditors } from './features/jobs/hooks/useJobs';
import { JobTable } from './components/organisms/JobTable';
import { JobForm } from './components/organisms/JobForm';
import { AssignmentModal } from './components/organisms/AssignmentModal';
import { StatusModal } from './components/organisms/StatusModal';

function App() {
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { mutate: createJob, isPending: isPendingCreateJob } = useCreateJob();
  const { mutate: updateStatus, isPending: isPendingUpdateStatus } = useUpdateJobStatus();
  const { mutate: assignReporter, isPending: isPendingAssignReporter } = useAssignReporter();
  const { mutate: assignEditor, isPending: isPendingAssignEditor } = useAssignEditor();

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [modalType, setModalType] = useState<'reporter' | 'editor' | 'status' | null>(null);

  const { data: reporters } = useReporters(activeJob?.id);
  const { data: editors } = useEditors();

  const handleOpenAssignReporter = (job: Job) => {
    setActiveJob(job);
    setModalType('reporter');
  };

  const handleOpenAssignEditor = (job: Job) => {
    setActiveJob(job);
    setModalType('editor');
  };

  const handleOpenUpdateStatus = (job: Job) => {
    setActiveJob(job);
    setModalType('status');
  };

  const handleAssignReporter = (reporterId: string) => {
    if (activeJob) {
      assignReporter({ jobId: activeJob.id, reporterId }, {
        onSuccess: () => setModalType(null)
      });
    }
  };

  const handleAssignEditor = (editorId: string) => {
    if (activeJob) {
      assignEditor({ jobId: activeJob.id, editorId }, {
        onSuccess: () => setModalType(null)
      });
    }
  };

  const handleUpdateStatus = (status: JobStatus) => {
    if (activeJob) {
      updateStatus({ id: activeJob.id, status }, {
        onSuccess: () => setModalType(null)
      });
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Court Reporting Workflow
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage jobs, assignments, and payments in one place.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        <section>
          <JobForm
            onSubmit={(data) => {
              createJob(data);
            }}
            isLoading={isPendingCreateJob} />
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Active Jobs</h2>
            <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>
              {jobs?.length || 0} Total Jobs
            </div>
          </div>
          <JobTable
            jobs={jobs || []}
            isLoading={jobsLoading}
            onAssignReporter={handleOpenAssignReporter}
            onAssignEditor={handleOpenAssignEditor}
            onUpdateStatus={handleOpenUpdateStatus}
          />
        </section>
      </div>

      {modalType === 'reporter' && (
        <AssignmentModal
          title="Assign Reporter"
          users={reporters || []}
          onSelect={handleAssignReporter}
          onClose={() => setModalType(null)}
          isLoading={isPendingAssignReporter}
        />
      )}

      {modalType === 'editor' && (
        <AssignmentModal
          title="Assign Editor"
          users={editors || []}
          onSelect={handleAssignEditor}
          onClose={() => setModalType(null)}
          isLoading={isPendingAssignEditor}
        />
      )}

      {modalType === 'status' && activeJob && (
        <StatusModal
          currentStatus={activeJob.status}
          onSelect={handleUpdateStatus}
          onClose={() => setModalType(null)}
          isLoading={isPendingUpdateStatus}
        />
      )}
    </div>
  );
}

export default App;

