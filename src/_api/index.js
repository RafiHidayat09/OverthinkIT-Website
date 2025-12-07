import axios from "axios";

const url = "https://backend-kelompokfwd5-sibm3.karyakreasi.id"

export const API  = axios.create({
  baseURL: `${url}/api`,
  headers: {
   // "Content-Type": "application/json",
   "Accept": "application/json",
  },
})

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const psikologImageStorage = `${url}/storage`;
export const articleImageStorage = `${url}/storage/articles`;

export default API;

