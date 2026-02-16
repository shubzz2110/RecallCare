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
