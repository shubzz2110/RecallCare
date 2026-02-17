export interface User {
  id: string;
  name: string;
  email: string;
  clinic?: {
    id: string;
    name: string;
  };
  role?: "ADMIN" | "CLINIC";
}

export interface InternalClinics {
  id: string;
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

export interface Patient {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  clinicId: string;
  createdAt: string;
}
