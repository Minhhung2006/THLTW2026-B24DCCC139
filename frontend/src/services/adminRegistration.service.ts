import axios from "axios";

const API_URL = `http://${window.location.hostname}:5000/api/registrations`;
const EXPORT_URL = `http://${window.location.hostname}:5000/api/export`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminRegistrations = async (params?: any) => {
  const response = await axios.get(API_URL, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
};

export const approveRegistration = async (id: string) => {
  const response = await axios.patch(`${API_URL}/${id}/approve`, {}, getAuthHeaders());
  return response.data;
};

export const rejectRegistration = async (id: string, note: string) => {
  const response = await axios.patch(`${API_URL}/${id}/reject`, { note }, getAuthHeaders());
  return response.data;
};

export const exportRegistrationsExcel = async (params?: any) => {
  const response = await axios.get(`${EXPORT_URL}/registrations`, {
    params,
    ...getAuthHeaders(),
    responseType: 'blob', // Quan trọng để tải file
  });
  return response;
};
