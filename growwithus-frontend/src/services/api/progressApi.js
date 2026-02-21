import http from "../http";

export const progressApi = {
  getMyProgress: async () => {
    const { data } = await http.get("/progress/me");
    return data;
  },
  upsertProgress: async (payload) => {
    const { data } = await http.put("/progress", payload);
    return data;
  }
};