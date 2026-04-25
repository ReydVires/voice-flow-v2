import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import { API_BASE_URL } from "../../../api/config";
import { handleResponse } from "../../../api/services";

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users`);
            return handleResponse<User[]>(res);
        },
        select: (res) => res.data ?? [],
    });
};
