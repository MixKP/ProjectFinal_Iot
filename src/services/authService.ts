import { http } from "./http";

export const authService = {
  async login(username: string, password: string) {
    const res = await http.post("/login", { username, password });
    return res.data;
  },

  async register(username: string, password: string) {
    const res = await http.post("/register", { username, password });
    return res.data;
  },

  async logout(username: string) {
    const res = await http.post("/logout", { username });
    return res.data;
  },
};
