// User types
export type UserRole = "admin" | "receptionist" | "doctor" | "patient";

export interface User {
  id: string; // e.g. "r0001", "d0001"
  name: string;
  email: string;
  role: UserRole;
}
