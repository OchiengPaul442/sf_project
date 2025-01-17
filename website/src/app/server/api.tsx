import axios from "axios";

// Create an Axios instance with the base URL from the environment variables
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle posting investment data
export const postInvestment = async (url: string, { arg }: { arg: any }) => {
  try {
    const response = await apiClient.post(url, arg);
    return response.data;
  } catch (error: any) {
    console.error("Error in postInvestment:", error);
    throw error.response?.data || error.message;
  }
};
