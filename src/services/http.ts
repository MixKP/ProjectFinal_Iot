import axios from "axios";

export const http = axios.create({
  baseURL: "/api", // ใช้ proxy ของ Vite (vite.config.ts)
  headers: { "Content-Type": "application/json" },
});