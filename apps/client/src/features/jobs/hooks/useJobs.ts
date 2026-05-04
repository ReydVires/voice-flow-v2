import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Job, User, ApiResponse } from '@mern/types';
import { API_BASE_URL as API_URL } from '../../../api/config';
import { handleResponse } from '../../../api/services';

export const useJobs = () => {
  return useQuery<ApiResponse<Job[]>, Error, Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/jobs`);
      return handleResponse(res);
    },
    select: (res) => res?.data || [],
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Job>, Error, Partial<Job>>({
    mutationFn: async (newJob) => {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useCompleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Job>, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/jobs/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};


export const useAssignReporter = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Job>, Error, { jobId: string; reporterId: string }>({
    mutationFn: async ({ jobId, reporterId }) => {
      const res = await fetch(`${API_URL}/jobs/${jobId}/assign-reporter`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId }),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useAssignEditor = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Job>, Error, { jobId: string; editorId: string }>({
    mutationFn: async ({ jobId, editorId }) => {
      const res = await fetch(`${API_URL}/jobs/${jobId}/assign-editor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editorId }),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useReporters = (jobId?: string, enabled = true) => {
  return useQuery<ApiResponse<User[]>, Error, User[]>({
    queryKey: ['reporters', jobId],
    queryFn: async () => {
      const url = jobId ? `${API_URL}/reporters?jobId=${jobId}` : `${API_URL}/reporters`;
      const res = await fetch(url);
      return handleResponse(res);
    },
    staleTime: 0,
    enabled: enabled && (!!jobId || jobId === undefined), // undefined is for general reporter list
    select: (res) => res?.data || [],
  });
};

export const useEditors = (enabled = true) => {
  return useQuery<ApiResponse<User[]>, Error, User[]>({
    queryKey: ['editors'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/editors`);
      return handleResponse(res);
    },
    enabled,
    select: (res) => res?.data || [],
  });
};

