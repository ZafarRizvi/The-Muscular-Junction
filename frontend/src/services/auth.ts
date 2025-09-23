import apiClient from "@/lib/apiClient";

export async function login(data: { userID: string; password: string }) {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
}

export async function logout() {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

export async function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  const response = await apiClient.post("/auth/change-password", data);
  return response.data;
}

// export async function resetPassword(data: { userID: string; newPassword: string }) {
//     const response = await apiClient.post("/auth/reset-password", data);
//     return response.data;
// }
