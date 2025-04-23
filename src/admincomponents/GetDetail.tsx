import React, { useEffect, useState } from "react";
import { fetchProductDetails } from "../api/productApi";
import { fetchCategory } from "../api/CategoryApi";
import { getProductReviews } from "../api/productApi";
import { IProduct } from "../types/product";
import { ICategory } from "../types/category";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (err) {
        setError("Không thể tải danh mục.");
      }
    };

    // hàm chỉnh sửa sản phẩm
    const handleEditProduct = () => {
      if (product && product._id) {
        navigate(`/admin/edit-product/${product._id}`);
      }
    };
    

    // lấy chi tiết sản phẩm
    const getProductDetail = async () => {
      try {
        if (!id) {
          setError("Không tìm thấy ID sản phẩm.");
          return;
        }
        const data = await fetchProductDetails(id);
        setProduct(data);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    // lấy đánh giá sản phẩm
    const getReviews = async () => {
      try {
        const data = await getProductReviews(id!);
        setReviews(data);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      }
    };

    getCategories();
    getProductDetail();
    getReviews();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Đang tải thông tin sản phẩm...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  const categoryName = categories.find(
    (category) => category._id === product?.category
  )?.name;

  const handleEditProduct = () => {
    if (product) {
      navigate(`/admin/edit-product/${product._id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product?.name}
          </h1>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">Mô tả:</span>{" "}
              {product?.description}
            </p>

            <p className="text-2xl font-bold text-red-600">
              {product?.price.toLocaleString()} VND
            </p>

            <div className="flex items-center space-x-2">
              <span className="font-semibold">Đánh giá:</span>
              <div className="flex items-center">
                <span className="text-yellow-400">
                  {"★".repeat(Math.round(product?.rating || 0))}
                </span>
                <span className="text-gray-400">
                  {"★".repeat(5 - Math.round(product?.rating || 0))}
                </span>
                <span className="ml-2 text-gray-600">
                  ({product?.numReviews} đánh giá)
                </span>
              </div>
            </div>

            <p className="text-gray-700">
              <span className="font-semibold">Số lượng trong kho:</span>{" "}
              {product?.countInStock ?? 0}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Danh mục:</span>{" "}
              {categoryName || "Không có danh mục"}
            </p>
          </div>

          <div className="mb-8">
            <button
              onClick={handleEditProduct}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 font-medium"
            >
              Chỉnh sửa sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">Chưa có đánh giá nào.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.name}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetDetail;