import type { ApiResponse } from "@mern/types";

export async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        const error = {
            message: `HTTP error! status: ${response.status}`,
            statusCode: response.status,
        };
        throw error;
    }
    return response.json();
}
