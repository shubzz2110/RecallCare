import { api } from "@/lib/api";
import { errorHandler } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { PaginationParams, Patient, PatientCreatePayload } from "@/types/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface PaginationMeta {
  page: number;
  limit: number;
  totalPatients: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PatientsResponse {
  success: boolean;
  patients: Patient[];
  pagination: PaginationMeta;
}

export function usePatients(params?: PaginationParams) {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return useQuery<PatientsResponse>({
    queryKey: ["patients", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await api(`/patients?${queryParams.toString()}`);
      return data;
    },
    enabled: isHydrated,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PatientCreatePayload) => {
      const { data } = await api.post<Patient>("/patients", payload);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all patient list queries so any mounted table/list refetches
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: any) => {
      errorHandler(error);
    },
  });
}

export function useUpdatePatient(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PatientCreatePayload>) => {
      const { data } = await api.put<Patient>(
        `/patients/${patientId}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all patient list queries so any mounted table/list refetches
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: any) => {
      errorHandler(error);
    },
  });
}

export function useDeletePatient(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/patients/${patientId}`);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all patient list queries so any mounted table/list refetches
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: any) => {
      errorHandler(error);
    },
  });
}
