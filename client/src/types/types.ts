export interface User {
  id: string;
  name: string;
  email: string;
  clinicId?: string;
  role?: "ADMIN" | "CLINIC";
}
