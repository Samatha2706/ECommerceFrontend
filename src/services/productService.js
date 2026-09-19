import api from "./api";

export const getProducts = async (filters = {}) => {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  if (filters.minPrice) {
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.sortBy) {
    params.sortBy = filters.sortBy;
  }

  if (filters.sortOrder) {
    params.sortOrder = filters.sortOrder;
  }

  params.pageNumber = filters.pageNumber || 1;
  params.pageSize = filters.pageSize || 10;

  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};