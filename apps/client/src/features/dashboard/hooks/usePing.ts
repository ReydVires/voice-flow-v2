import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../../../api/config";
import { handleResponse } from "../../../api/services";

export const usePing = () => {
    return useQuery({
        queryKey: ['ping'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/health`)
            return handleResponse<{ status: string }>(res);
        },
        select: (res) => res.data?.status || 'unavailable',
    });
};
