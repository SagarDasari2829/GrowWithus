import http from "../http";

export const roadmapApi = {
  getRoadmaps: async (params = {}) => {
    const { data } = await http.get("/roadmaps", { params });
    return data;
  },
  getRoadmapById: async (id) => {
    const { data } = await http.get(`/roadmaps/${id}`);
    return data;
  },
  getRoadmapBySlug: async (slug) => {
    const { data } = await http.get(`/roadmaps/slug/${slug}`);
    return data;
  },
  createRoadmap: async (payload) => {
    const { data } = await http.post("/roadmaps", payload);
    return data;
  },
  updateRoadmap: async (id, payload) => {
    const { data } = await http.put(`/roadmaps/${id}`, payload);
    return data;
  },
  deleteRoadmap: async (id) => {
    await http.delete(`/roadmaps/${id}`);
  }
};
