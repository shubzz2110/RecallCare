export interface User {
  _id: string;
  name: string;
  email: string;
  clinic?: {
    _id: string;
    name: string;
  };
  role?: "ADMIN" | "CLINIC";
}

export interface InternalClinics {
  _id: string;
  name: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  users: {
    name: string;
    email: string;
    isActive: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ClinicCreatePayload {
  clinicName: string;
  doctorName: string;
  doctorEmail: string;
  phone: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Patient {
  _id: string;
  name: string;
  phone: string;
  clinic: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreatePayload {
  name: string;
  phone: string;
}
