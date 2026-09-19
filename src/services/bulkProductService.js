import api from "./api";

export const downloadBulkTemplate = async () => {
  const response = await api.get(
    "/products/bulk-upload/template",
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const uploadBulkProducts = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/products/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};