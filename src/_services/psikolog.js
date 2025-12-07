// src/_services/psikolog.js
import { API } from "../_api"; 

export const getPsikologProfile = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await API.get("/psychologist/psikolog-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data.data;
};
