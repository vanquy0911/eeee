// 📦 Component: EditProduct.tsx - Trang chỉnh sửa sản phẩm cho Admin

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductDetails, updateProduct, ProductUpdatePayload } from "../api/productApi";
import { fetchCategory } from "../api/CategoryApi";
import { IProduct } from "../types/product";
import { ICategory } from "../types/category";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";


const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

//   const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState<ProductUpdatePayload>({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    category: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null); // ✅  trạng thái cho file ảnh
  // Hàm xử lý upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Thiếu ID sản phẩm.");
        setLoading(false);
        return;
      }
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProductDetails(id),
          fetchCategory(),
        ]);
        // setProduct(productData);
        setCategories(categoryData);
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          countInStock: productData.countInStock,
          category: productData.category,
          image: productData.image,
        });
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "countInStock" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token || !id) return;

  try {
    let imageUrl = formData.image;

    // 👉 Nếu có file ảnh mới, upload trước
    if (imageFile) {
      const imageData = new FormData();
      imageData.append("image", imageFile);

      const uploadRes = await api.post("/upload", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      imageUrl = uploadRes.data.imageUrl; // ✅ Dùng ảnh mới
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }

    // Gọi API cập nhật
    await updateProduct(id, { ...formData, image: imageUrl }, token);

    alert("✅ Cập nhật sản phẩm thành công!");
    navigate(`/admin/products`);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    alert("❌ Cập nhật thất bại. Vui lòng thử lại.");
  }
};


  if (loading) return <p className="text-center mt-10 text-lg">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên sản phẩm</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={4} />
        </div>

        <div>
          <label className="block font-medium">Giá (VND)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" min={0} required />
        </div>

        <div>
          <label className="block font-medium">Số lượng kho</label>
          <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className="w-full border px-3 py-2 rounded" min={0} required />
        </div>

        <div>
          <label className="block font-medium">Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
            <label className="block font-medium">Ảnh sản phẩm</label>

            {/* Hiển thị ảnh hiện tại nếu có */}
            {formData.image && (
                <img
                src={formData.image}
                alt="Ảnh hiện tại"
                className="mt-2 w-32 h-32 object-cover rounded border"
                />
            )}

            {/* Input file để chọn ảnh mới */}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-3 w-full border px-3 py-2 rounded"
            />
        </div>


        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          💾 Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditProduct;