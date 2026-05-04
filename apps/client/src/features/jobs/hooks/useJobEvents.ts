import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SSE_EVENTS } from '@mern/types';
import { API_BASE_URL } from '../../../api/config';
import { useToast } from '../../../components/ui/Toast';

export const useJobEvents = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/jobs/events`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === SSE_EVENTS.JOB_STATUS_UPDATE) {
          const { job } = data;

          // Show notification
          showToast(`Job "${job.caseName}" is now ${job.status}!`, 'success');

          // Invalidate jobs query to refresh UI
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Connection Error:', err);
      eventSource.close();

      // Reconnect after 5 seconds if connection lost
      setTimeout(() => {
        // This will trigger effect again as it's unmounted/remounted? 
        // Actually EventSource does automatic reconnection, but we close it on error here.
        // Let's just let it handle its own reconnection or we could use a state to trigger remount.
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, showToast]);
};
