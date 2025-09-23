import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true, // Include cookies for cross-origin requests
});

export default apiClient;
