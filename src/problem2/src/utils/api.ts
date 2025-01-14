import { API_ENDPOINT, API_TIMEOUT } from "@/constants/common";
import { ERROR_TOAST_TIMEOUT } from "@/constants/toast";
import { notification } from "antd";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// This is just a simple configuration

interface IApiConfig {
  baseURL: string;
  timeout: number;
}

interface IErrorDetails {
  [key: string]: string;
}

interface IErrorResponseData {
  message?: string;
  errors?: IErrorDetails;
}

interface ErrorResponse {
  status?: number;
  message?: string;
  data?: any;
}

const apiConfig: IApiConfig = {
  baseURL: API_ENDPOINT || "",
  timeout: API_TIMEOUT,
};

export const axiosInstance: AxiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(
  async function (config) {
    // Customizing the request
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<IErrorResponseData>) => {
    const errorResponse: ErrorResponse = {};

    if (error.response) {
      // The request was made and the server responded with a status code
      errorResponse.status = error.response.status;
      errorResponse.message = "Response Error";
      errorResponse.data = error.response.data;

      if (errorResponse.status === 401) {
        // Handle logout here
        return;
      }

      // Type assertion for error response data
      const responseData = error.response.data as IErrorResponseData;

      if (responseData.errors) {
        // Display each error message using toast
        Object.values(responseData.errors).forEach((msg: string) => {
          notification.error({ message: msg, duration: ERROR_TOAST_TIMEOUT });
        });
      } else {
        notification.error({ message: responseData.message || "Something went wrong", duration: ERROR_TOAST_TIMEOUT });
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.message = "Request Error";
      notification.error({ message: "No response received from server", duration: ERROR_TOAST_TIMEOUT });
    } else {
      // Something happened in setting up the request
      errorResponse.message = "General Error";
      errorResponse.data = error.message;
      notification.error({ message: "An error occurred: " + error.message, duration: ERROR_TOAST_TIMEOUT });
    }

    console.error(errorResponse);
    return Promise.reject(errorResponse);
  }
);

// API methods
const api = {
  // GET request
  get: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.get<T>(url),

  // POST request
  post: <T>(url: string, data: any, config?: any): Promise<AxiosResponse<T>> =>
    axiosInstance.post<T>(url, data, config),

  // PUT request
  put: <T>(url: string, data: any): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data),

  // DELETE request
  delete: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url),
};

export default api;
