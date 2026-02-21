import http from "../http";

export const authApi = {
  register: async (payload) => {
    const { data } = await http.post("/auth/register", payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await http.post("/auth/login", payload);
    return data;
  }
};