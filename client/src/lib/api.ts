import { useAuthStore } from "@/store/auth";

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(null);
  });
  failedQueue = [];
};

const baseURL = String(import.meta.env.VITE_API_BASE_URL);

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest: any = error.config;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/token/refresh");

    // Handle 401 - try to refresh token
    if (
      !isAuthEndpoint &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${baseURL}/auth/token/refresh`,
          {},
          { withCredentials: true },
        );

        if (response.data.success) {
          useAuthStore
            .getState()
            .setAuth(response.data.userDetails, response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        }
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh Token has been expired logout the user");
        processQueue(refreshError);
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = `/login?reason=expired`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const api = axiosInstance;
