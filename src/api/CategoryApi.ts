import api from "../config/axios"; // Import axios đã config

export const fetchCategory = async () => {
  try {
    const response = await api.get("/categories"); // Không cần baseURL nữa
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    throw error;
  }
};
