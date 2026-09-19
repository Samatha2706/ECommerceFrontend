import api from "./api";

export const getAllOrders = async () => {
  const response = await api.get("/Order/admin/all");
  return response.data;
};

export const getOrderForAdmin = async (orderId) => {
  const response = await api.get(`/Order/admin/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/Order/admin/${orderId}/status`, {
    status: Number(status),
  });

  return response.data;
};
