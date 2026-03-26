import API from "./api";

export const sendBillingReminder = async (data) => {
  const res = await API.post("/email/billing", data);
  return res.data;
};