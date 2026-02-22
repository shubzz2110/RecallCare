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

export interface Patient {
  _id: string;
  name: string;
  phone: string;
  notes?: string;
  clinicId: string;
  createdAt: string;
}
