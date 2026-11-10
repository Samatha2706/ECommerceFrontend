import api from "./api";

export const processPayment = async (orderId, paymentMethod) => {
  const response = await api.post(`/Order/${orderId}/pay`, {
    paymentMethod,
  });

  return response.data;
};

export const getPaymentByOrderId = async (orderId) => {
  const response = await api.get(`/Payment/order/${orderId}`);
  return response.data;
};
