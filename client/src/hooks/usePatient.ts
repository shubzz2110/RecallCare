import { api } from "@/lib/api";
import type { Patient } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

interface PatientResponse {
  success: boolean;
  patient: Patient;
}

async function fetchPatient(patientId: string): Promise<Patient> {
  const { data } = await api.get<PatientResponse>(`/patients/${patientId}`);
  return data.patient;
}

export function usePatient(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient", patientId], // Different key: "patient" (singular) vs "patients" (list)
    queryFn: () => fetchPatient(patientId!),
    enabled: !!patientId, // Only run if patientId exists
    staleTime: 60000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
