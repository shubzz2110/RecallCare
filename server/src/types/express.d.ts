import { User } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: UserRole;
        clinicId?: string | null;
      };
    }
  }
}
