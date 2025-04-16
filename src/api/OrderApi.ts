import api from "../config/axios";

export const createOrder = async (token: string, orderData: any) => {
  try {
    const response = await api.post("/orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi tạo đơn hàng!");
  }
};

// ✅ Lấy link thanh toán từ VNPay
export const createPaymentLink = async (token: string, orderId: string) => {
  try {
    console.log("Requesting payment link for orderId:", orderId); // Log orderId khi gọi API VNPay
    const vnPayResponse = await api.post(
      "/vnpay/create",
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Payment link received from VNPay:", vnPayResponse.data); // Log dữ liệu trả về từ VNPay
    // Giả sử API trả về trực tiếp URL thanh toán
    const paymentLink = vnPayResponse.data;
    return paymentLink;
  } catch (error: any) {
    console.error("Error while fetching payment link from VNPay:", error); // Log lỗi nếu có
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy link thanh toán!"
    );
  }
};
export const getOrders = async (token: string) => {
  try {
    const response = await api.get("/orders/me", {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data; // Trả về danh sách đơn hàng
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng!"
    );
  }
};
export const cancelOrder = async (token: string, orderId: string) => {
  try {
    const response = await api.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data; // Trả về phản hồi từ API khi đơn hàng bị hủy
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi hủy đơn hàng!");
  }
};

export const updateOrderPaymentStatus = async (
  token: string,
  orderId: string
) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/pay`, // Giả sử API path là /orders/:id/pay
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data; // Trả về phản hồi từ API khi cập nhật trạng thái thanh toán
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật trạng thái thanh toán!"
    );
  }
};
