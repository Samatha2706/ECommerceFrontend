import api from "./api";

export const checkout = async (shippingAddress) => {
  const response = await api.post("/Order/checkout", {
    shippingAddress,
  });

  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/Order");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/Order/${orderId}`);
  return response.data;
};