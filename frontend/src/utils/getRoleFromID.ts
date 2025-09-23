// src/utils/getRoleFromId.ts
import { UserRole } from "@/types/user";

export function getRoleFromID(id: string): UserRole {
  if (id.startsWith("a")) return "admin";
  if (id.startsWith("r")) return "receptionist";
  if (id.startsWith("d")) return "doctor";
  if (id.startsWith("p")) return "patient";
  throw new Error("Unknown role in id: " + id);
}
