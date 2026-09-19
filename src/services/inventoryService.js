import api from "./api";

export const getInventoryByProductId = async (productId) => {
  const response = await api.get(`/Inventory/${productId}`);
  return response.data;
};

export const updateInventory = async (productId, inventory) => {
  const response = await api.put(`/Inventory/${productId}`, inventory);
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get("/Inventory/low-stock");
  return response.data;
};
