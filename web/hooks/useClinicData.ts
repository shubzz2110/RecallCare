import { api } from "@/lib/api";
import { errorHandler } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import {
  ClinicCreatePayload,
  InternalClinics,
  PaginationParams,
} from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalClinics: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ClinicsResponse {
  success: boolean;
  clinics: InternalClinics[];
  pagination: PaginationMeta;
}

export function useClinics(params?: PaginationParams) {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return useQuery<ClinicsResponse>({
    queryKey: ["clinics", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await api(`/internal/clinics?${queryParams.toString()}`);
      return data;
    },
    enabled: isHydrated,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateClinic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClinicCreatePayload) => {
      const { data } = await api.post<InternalClinics>(
        "/internal/clinics",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all clinic list queries so any mounted table/list refetches
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
    onError: (error: any) => {
      errorHandler(error);
    },
  });
}
