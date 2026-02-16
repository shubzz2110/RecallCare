import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandler(error: any) {
  console.log(error);
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "Operation failed. Please try again.";

    toast.error("Operation failed", {
      description: errorMessage,
    });
  } else {
    // Handle non-axios errors
    toast.error("Operation failed", {
      description: "An unexpected error occurred. Please try again.",
    });
  }
}
