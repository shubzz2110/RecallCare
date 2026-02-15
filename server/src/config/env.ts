export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in environment variables");
}
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}
if (!ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in environment variables",
  );
}
if (!REFRESH_TOKEN_SECRET) {
  throw new Error(
    "REFRESH_TOKEN_SECRET is not defined in environment variables",
  );
}
