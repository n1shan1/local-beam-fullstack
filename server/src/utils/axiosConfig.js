import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081", // Ensure this URL is correct
  timeout: 10000, // Set a timeout for requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Backend error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
