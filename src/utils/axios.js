import axios from "axios";
import Swal from "sweetalert2";

import { logout } from "./logout";
// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 402) {
      logout();
      // Swal.fire({ title: "Oops...", text: "Your Session Has Expired Please Login Again!", icon: "error" }).then(
      //   (result) => {
      //   },
      // );
    } else {
      Swal.fire({ title: "Oops...", text: "Server Error!", icon: "error" }).then(() => {});
    }
    return Promise.reject((error.response && error.response.data) || "Something went wrong");
  },
);

export const apiGet = async (api) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}${api}`, {
    headers,
  });
  return res.data;
};

export const apiPost = async (api, body) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}${api}`, body, {
    headers,
  });
  return res.data;
};

export const apiPostFile = async (api, body) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}${api}`, body, {
    headers,
  });
  return res.data;
};

export const apiPut = async (api, body) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.put(`${import.meta.env.VITE_SERVER_URL}${api}`, body, {
    headers,
  });
  return res.data;
};

export default axiosInstance;
