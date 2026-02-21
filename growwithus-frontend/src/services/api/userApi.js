import http from "../http";

export const userApi = {
  getMe: async () => {
    const { data } = await http.get("/users/me");
    return data;
  },
  getAllUsers: async () => {
    const { data } = await http.get("/users");
    return data;
  }
};