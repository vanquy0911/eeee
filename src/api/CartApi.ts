import api from "../config/axios"; // Import axios đã config

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (
  productId: string,
  quantity: number,
  token: string
) => {
  try {
    const response = await api.post(
      "/cart/add", // URL đã được cấu hình với baseURL trong axios.ts
      { productId, quantity }, // Gửi productId và quantity trong body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực
        },
      }
    );
    return response.data; // Trả về dữ liệu từ backend (có thể là giỏ hàng mới hoặc thông báo thành công)
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể thêm vào giỏ hàng!"
    );
  }
};

// Hàm lấy giỏ hàng người dùng
export const getCart = async (token: string) => {
  try {
    const response = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực
      },
    });
    return response.data; // Trả về dữ liệu giỏ hàng người dùng
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể lấy giỏ hàng!");
  }
};
// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (productId: string, token: string) => {
  try {
    const response = await api.delete(`/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực
      },
    });
    return response.data; // Trả về dữ liệu giỏ hàng sau khi cập nhật
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể xóa sản phẩm khỏi giỏ hàng!"
    );
  }
};
export const updateCartItem = async (
  productId: string,
  quantity: number,
  token: string
) => {
  try {
    const response = await api.put(
      `/cart/update`, // API cập nhật giỏ hàng
      { productId, quantity }, // Gửi id sản phẩm và số lượng
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      }
    );
    return response.data; // Trả về dữ liệu giỏ hàng sau khi cập nhật
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật giỏ hàng!"
    );
  }
};
