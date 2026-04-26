import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Job, User, JobStatus } from '@mern/types';
import { API_BASE_URL as API_URL } from '../../../api/config';
import { handleResponse } from '../../../api/services';

export const useJobs = () => {
  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await handleResponse<Job[]>(res);
      return data.data || [];
    },
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newJob: Partial<Job>) => {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      return handleResponse<Job>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      const res = await fetch(`${API_URL}/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return handleResponse<Job>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useAssignReporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, reporterId }: { jobId: string; reporterId: string }) => {
      const res = await fetch(`${API_URL}/jobs/${jobId}/assign-reporter`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId }),
      });
      return handleResponse<Job>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useAssignEditor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, editorId }: { jobId: string; editorId: string }) => {
      const res = await fetch(`${API_URL}/jobs/${jobId}/assign-editor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editorId }),
      });
      return handleResponse<Job>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useReporters = (jobId?: string) => {
  return useQuery<User[]>({
    queryKey: ['reporters', jobId],
    queryFn: async () => {
      const url = jobId ? `${API_URL}/reporters?jobId=${jobId}` : `${API_URL}/reporters`;
      const res = await fetch(url);
      const data = await handleResponse<User[]>(res);
      return data.data || [];
    },
  });
};

export const useEditors = () => {
  return useQuery<User[]>({
    queryKey: ['editors'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/editors`);
      const data = await handleResponse<User[]>(res);
      return data.data || [];
    },
  });
};
