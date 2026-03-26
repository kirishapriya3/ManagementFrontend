import API from "./api";

export const allocateRoom = async (data) => {
  const res = await API.post("/system/room", data);
  return res.data;
};