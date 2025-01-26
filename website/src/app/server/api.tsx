import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

// Create a base URL from the environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Generic function to handle API calls
async function apiCall<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<T> {
  const config: AxiosRequestConfig = {
    method,
    url,
  };

  if (data) {
    if (data instanceof FormData) {
      config.data = data;
      // Do not set 'Content-Type'; let Axios handle it
    } else {
      config.data = data;
      config.headers = {
        "Content-Type": "application/json",
      };
    }
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error(`Error in API call to ${url}:`, error);
    throw error;
  }
}

// Specific API functions
export const postContactUs = (url: string, { arg }: { arg: any }) =>
  apiCall<any>(url, "POST", arg);

export const postInvestment = (url: string, { arg }: { arg: any }) =>
  apiCall<any>(url, "POST", arg);

export const postEngineers = async (
  url: string,
  { arg }: { arg: FormData }
) => {
  // For file uploads, we use FormData
  return apiCall<any>(url, "POST", arg);
};

export const postRestaurants = (url: string, { arg }: { arg: any }) =>
  apiCall<any>(url, "POST", arg);

export default apiCall;
