import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api", withCredentials: true });

export const register = async (details) => (await api.post("/auth/register", details)).data;
export const login = async (details) => (await api.post("/auth/login", details)).data;
export const logout = async () => (await api.get("/auth/logout")).data;
export const getMe = async () => (await api.get("/auth/get-me")).data;
