// 📦 Enhanced CategoryManager.tsx - Giao diện bảng + Phân trang

import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";


interface Category {
  _id: string;
  name: string;
  productCount?: number; 
}

const PAGE_SIZE = 5;

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  const fetchDeleteCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchDeleteCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) return;
  
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await api.post("/categories", { name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm danh mục thành công!");
      }
  
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
      toast.error("Xảy ra lỗi khi thêm!");
    }
  };
  

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xoá danh mục thành công!");
      fetchCategories(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      toast.error("Xảy ra lỗi khi xoá danh mục!");
    }
  };
  
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const allCategories = res.data;
      const totalPages = Math.ceil(allCategories.length / PAGE_SIZE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      setCategories(allCategories);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(categories.length / PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4">🗂️ Quản lý danh mục</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nhập tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editingId ? "Lưu" : "Thêm"}
        </button>
      </form>

      <div className="overflow-x-auto border rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Tên danh mục</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat, index) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td className="px-4 py-2">{cat.name}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setName(cat.name);
                      setEditingId(cat._id);
                    }}
                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
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
  );
};

export default CategoryManager;
