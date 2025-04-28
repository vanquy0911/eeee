import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await api.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchUserDetail();
  }, [id, token]);

  if (!user) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">👤 Thông tin chi tiết người dùng</h2>

      <div className="space-y-4 text-gray-800">
        <p><strong>Họ tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vai trò:</strong> {user.isAdmin ? "Admin" : "User"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
      </div>
    </div>
  );
};

export default UserDetail;
