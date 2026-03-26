import API from "./api";

export const sendMaintenanceUpdate = async (data) => {
  const res = await API.post("/system/maintenance", data);
  return res.data;
};