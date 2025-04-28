import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 


interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}
// 
// const navigate = useNavigate();

const AdminUserManager: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; isAdmin: boolean }>({
    name: "",
    isAdmin: false,    
  });

  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // 👈 lấy trực tiếp từ localStorage
      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user: User) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, isAdmin: user.isAdmin });
  };

  const handleSave = async (id: string) => {
    try {
      await api.put(`/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xoá người dùng:", err);
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">👥 Quản lý người dùng</h2>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Họ tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Vai trò</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-center">
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{index + 1}</td>

                {/* Họ tên */}
                <td className="px-4 py-2">
                  {editingId === user._id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="border px-2 py-1 rounded w-full text-left"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {user.name}
                    </span>
                  )}
                </td>

                {/* Email */}
                <td className="px-4 py-2 text-gray-600">{user.email}</td>

                {/* Vai trò */}
                <td className="px-4 py-2">
                  {editingId === user._id ? (
                    <select
                      value={editForm.isAdmin ? "admin" : "user"}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          isAdmin: e.target.value === "admin",
                        }))
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`font-medium px-2 py-1 rounded-full text-xs ${
                        user.isAdmin
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  )}
                </td>

                {/* Ngày tạo */}
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </td>

                {/* Hành động */}
                <td className="px-4 py-2 space-x-2">
                  {editingId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSave(user._id)}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 font-semibold hover:underline"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <>
                    <button
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Xem
                      </button>

                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManager;
