import api from "./api";

export const logout = async () => {
  try {
    await api.post("/admin/logout");
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
