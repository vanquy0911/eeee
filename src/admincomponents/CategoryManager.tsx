import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  _id: string;
  name: string;
}

const PAGE_SIZE = 5;

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      toast.error("❌ Lỗi khi tải danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Cập nhật danh mục thành công!");
      } else {
        await api.post("/categories", { name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Thêm danh mục thành công!");
      }
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
      toast.error("❌ Xảy ra lỗi khi thêm/sửa danh mục!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xoá danh mục thành công!");
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xoá danh mục:", err);
      toast.error("❌ Xảy ra lỗi khi xoá danh mục!");
    }
  };

  const paginatedCategories = categories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(categories.length / PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        📦 Quản lý danh mục
      </h2>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Nhập tên danh mục..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {editingId ? "Lưu" : "Thêm"}
        </button>
      </form>

      {/* Bảng danh mục */}
      <div className="overflow-x-auto sm:overflow-x-visible border rounded-xl shadow-xl bg-white">
      <table className="min-w-full text-sm">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Tên danh mục</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat, index) => (
              <tr
                key={cat._id}
                className="border-t hover:bg-gray-50 hover:scale-[1.01] transition-transform"
              >
                <td className="px-6 py-3">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td className="px-6 py-3 font-semibold">{cat.name}</td>
                <td className="px-6 py-3 text-center space-x-3">
                  <button
                    onClick={() => {
                      setName(cat.name);
                      setEditingId(cat._id);
                    }}
                    className="inline-block px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="inline-block px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border font-semibold transition ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
     </div>
  );
};

export default CategoryManager;
