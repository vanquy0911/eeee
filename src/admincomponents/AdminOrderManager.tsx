// 📦 AdminOrderManager.tsx - Quản lý đơn hàng cho Admin

import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  totalPrice: number;
  createdAt: string;
  isDelivered: boolean;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
}

const AdminOrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const result = await api.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(result.data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await api.put(
        `/orders/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "confirmed" } : o))
      );
    } catch (err) {
      console.error("Lỗi khi xác nhận đơn hàng:", err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.put(
        `/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("Lỗi khi huỷy đơn hàng:", err);
    }
  };

  const handleShip = async (id: string) => {
    try {
      await api.put(
        `/orders/${id}/ship`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "shipping" } : o))
      );
    } catch (err) {
      console.error("Lỗi khi chuyển sang giao hàng:", err);
    }
  };

  const statusLabel = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn tất",
    cancelled: "Đã huỷ",
  };

  return (
    <div className="bg-gray p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">📋 Quản lý đơn hàng</h2>
      {loading ? (
        <p className="text-center text-gray-500">Đang tải đơn hàng...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Khách hàng</th>
                <th className="px-4 py-2">Tổng tiền</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày đặt hàng</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {[...orders]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((order, index) => (
                  <tr key={order._id} className="border-t text-center">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td>{order.user?.name || "Ẩn danh"}</td>
                    <td>{order.totalPrice.toLocaleString("vi-VN")} VND</td>
                    <td>{statusLabel[order.status] || "Không rõ"}</td>
                    <td>
                      {format(new Date(order.createdAt), "dd/MM/yyyy - HH:mm")}
                    </td>
                    <td className="space-x-2">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Xem
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleConfirm(order._id)}
                          className="text-green-600 hover:underline"
                        >
                          Xác nhận
                        </button>
                      )}
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => handleShip(order._id)}
                          className="text-yellow-600 hover:underline"
                        >
                          Giao hàng
                        </button>
                      )}
                      {order.status !== "completed" && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="text-red-600 hover:underline"
                        >
                          Huỷ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManager;
