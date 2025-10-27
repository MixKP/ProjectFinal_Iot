import { http } from "./http";

export const waterService = {
  async getStatus() {
    const res = await http.get("/status");
    return res.data;
  },

  async resetWater() {
    const res = await http.post("/device/reset");
    return res.data;
  },

  async updateWater(used: number, username: string) {
    const res = await http.post("/device/update", { used, username });
    return res.data;
  },
};
