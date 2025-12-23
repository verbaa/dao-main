import {API_BASE_URL} from "../constants";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (json.success !== true) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data;
}