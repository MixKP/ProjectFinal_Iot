import axios from "axios";

const API_BASE = "http://172.20.10.2:3000/api";

export const authService = {
  register(username: string, password: string) {
    return axios.post(`${API_BASE}/register`, { username, password });
  },
  login(username: string, password: string) {
    return axios.post(`${API_BASE}/login`, { username, password });
  },
  logout() {
    return axios.post(`${API_BASE}/logout`);
  },
  getDashboard() {
    return axios.get(`${API_BASE}/dashboard`);
  },
  resetDevice() {
    return axios.post(`${API_BASE}/device/reset`);
  },
};
